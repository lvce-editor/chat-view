import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { appendMessageToSelectedSession } from '../AppendMessageToSelectedSession/AppendMessageToSelectedSession.ts'
import { appendChatViewEvent, getChatSession, saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { executeSlashCommand } from '../ExecuteSlashCommand/ExecuteSlashCommand.ts'
import * as FocusInput from '../FocusInput/FocusInput.ts'
import { generateSessionId } from '../GenerateSessionId/GenerateSessionId.ts'
import { getAiResponse } from '../GetAiResponse/GetAiResponse.ts'
import { getAiSessionTitle } from '../GetAiSessionTitle/GetAiSessionTitle.ts'
import { getMinComposerHeightForState } from '../GetComposerHeight/GetComposerHeight.ts'
import { getMentionContextMessage } from '../GetMentionContextMessage/GetMentionContextMessage.ts'
import { getNextAutoScrollTop } from '../GetNextAutoScrollTop/GetNextAutoScrollTop.ts'
import { getSlashCommand } from '../GetSlashCommand/GetSlashCommand.ts'
import { getSseEventType } from '../GetSseEventType/GetSseEventType.ts'
import {
  handleToolCallsChunkFunction,
  handleTextChunkFunction,
  type HandleTextChunkState,
  updateMessageTextInSelectedSession,
} from '../HandleTextChunkFunction/HandleTextChunkFunction.ts'
import { isDefaultSessionTitle } from '../IsDefaultSessionTitle/IsDefaultSessionTitle.ts'
import { isStreamingFunctionCallEvent } from '../IsStreamingFunctionCallEvent/IsStreamingFunctionCallEvent.ts'
import { parseAndStoreMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'
import { updateSessionTitle } from '../UpdateSessionTitle/UpdateSessionTitle.ts'
import { withUpdatedChatInputHistory } from '../WithUpdatedChatInputHistory/WithUpdatedChatInputHistory.ts'

const withUpdatedMessageScrollTop = (state: ChatState): ChatState => {
  if (!state.messagesAutoScrollEnabled) {
    return state
  }
  return {
    ...state,
    messagesScrollTop: getNextAutoScrollTop(state.messagesScrollTop),
  }
}

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  const {
    aiSessionTitleGenerationEnabled,
    assetDir,
    authAccessToken,
    authEnabled,
    backendUrl,
    composerValue,
    emitStreamingFunctionCallEvents,
    mockAiResponseDelay,
    mockApiCommandId,
    models,
    nextMessageId,
    openApiApiBaseUrl,
    openApiApiKey,
    openRouterApiBaseUrl,
    openRouterApiKey,
    passIncludeObfuscation,
    platform,
    questionToolEnabled,
    selectedModelId,
    selectedSessionId,
    sessions,
    streamingEnabled,
    systemPrompt,
    useChatCoordinatorWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useMockApi,
    viewMode,
    webSearchEnabled,
  } = state
  const userText = composerValue.trim()
  if (!userText) {
    return state
  }

  const slashCommand = getSlashCommand(userText)
  if (slashCommand) {
    return executeSlashCommand(state, slashCommand)
  }

  const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const userMessageId = crypto.randomUUID()
  const userMessage: ChatMessage = {
    id: userMessageId,
    role: 'user',
    text: userText,
    time: userTime,
  }
  const assistantMessageId = crypto.randomUUID()
  const assistantTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const inProgressAssistantMessage: ChatMessage = {
    id: assistantMessageId,
    inProgress: true,
    role: 'assistant',
    text: '',
    time: assistantTime,
  }
  let { parsedMessages } = state
  parsedMessages = await parseAndStoreMessageContent(parsedMessages, userMessage)
  parsedMessages = await parseAndStoreMessageContent(parsedMessages, inProgressAssistantMessage)

  let workingSessions = sessions
  if (viewMode === 'detail') {
    const loadedSession = await getChatSession(selectedSessionId)
    if (loadedSession) {
      workingSessions = sessions.map((session) => {
        if (session.id !== selectedSessionId) {
          return session
        }
        return loadedSession
      })
    }
  }

  let optimisticState: ChatState
  const createsNewSession = viewMode === 'list'
  if (viewMode === 'list') {
    const newSessionId = generateSessionId()
    await appendChatViewEvent({
      sessionId: newSessionId,
      timestamp: new Date().toISOString(),
      type: 'handle-submit',
      value: userText,
    })
    const newSession: ChatSession = {
      id: newSessionId,
      messages: streamingEnabled ? [userMessage, inProgressAssistantMessage] : [userMessage],
      title: `Chat ${workingSessions.length + 1}`,
    }
    await saveChatSession(newSession)
    optimisticState = withUpdatedMessageScrollTop(
      FocusInput.focusInput({
        ...state,
        composerHeight: getMinComposerHeightForState(state),
        composerValue: '',
        inputSource: 'script',
        lastSubmittedSessionId: newSessionId,
        nextMessageId: nextMessageId + 1,
        parsedMessages,
        selectedSessionId: newSessionId,
        sessions: [...workingSessions, newSession],
        viewMode: 'detail',
      }),
    )
    optimisticState = withUpdatedChatInputHistory(optimisticState, userText)
  } else {
    await appendChatViewEvent({
      sessionId: selectedSessionId,
      timestamp: new Date().toISOString(),
      type: 'handle-submit',
      value: userText,
    })
    const updatedWithUser = appendMessageToSelectedSession(workingSessions, selectedSessionId, userMessage)
    const updatedSessions = streamingEnabled
      ? appendMessageToSelectedSession(updatedWithUser, selectedSessionId, inProgressAssistantMessage)
      : updatedWithUser
    const selectedSession = updatedSessions.find((session) => session.id === selectedSessionId)
    if (selectedSession) {
      await saveChatSession(selectedSession)
    }
    optimisticState = withUpdatedMessageScrollTop(
      FocusInput.focusInput({
        ...state,
        composerHeight: getMinComposerHeightForState(state),
        composerValue: '',
        inputSource: 'script',
        lastSubmittedSessionId: selectedSessionId,
        nextMessageId: nextMessageId + 1,
        parsedMessages,
        sessions: updatedSessions,
      }),
    )
    optimisticState = withUpdatedChatInputHistory(optimisticState, userText)
  }

  set(state.uid, state, optimisticState)
  // @ts-ignore
  await RendererWorker.invoke('Chat.rerender')

  let handleTextChunkState: HandleTextChunkState = {
    latestState: optimisticState,
    previousState: optimisticState,
  }
  const selectedOptimisticSession = optimisticState.sessions.find((session) => session.id === optimisticState.selectedSessionId)
  const messages = (selectedOptimisticSession?.messages ?? []).filter((message) => !message.inProgress)
  const mentionContextMessage = await getMentionContextMessage(userText)
  const messagesWithMentionContext = mentionContextMessage ? [...messages, mentionContextMessage] : messages

  const handleTextChunkFunctionRef = streamingEnabled
    ? async (chunk: string): Promise<void> => {
        handleTextChunkState = await handleTextChunkFunction(state.uid, assistantMessageId, chunk, handleTextChunkState)
      }
    : undefined

  const assistantMessage = await getAiResponse({
    assetDir,
    authAccessToken,
    authEnabled,
    backendUrl,
    messageId: assistantMessageId,
    messages: messagesWithMentionContext,
    mockAiResponseDelay,
    mockApiCommandId,
    models,
    nextMessageId: optimisticState.nextMessageId,
    onDataEvent: async (value: unknown): Promise<void> => {
      if (!emitStreamingFunctionCallEvents && isStreamingFunctionCallEvent(value)) {
        return
      }
      const sseEventType = getSseEventType(value)
      await appendChatViewEvent({
        sessionId: optimisticState.selectedSessionId,
        timestamp: new Date().toISOString(),
        type: sseEventType,
        value,
      })
    },
    onEventStreamFinished: async (): Promise<void> => {
      await appendChatViewEvent({
        sessionId: optimisticState.selectedSessionId,
        timestamp: new Date().toISOString(),
        type: 'event-stream-finished',
        value: '[DONE]',
      })
    },
    ...(handleTextChunkFunctionRef
      ? {
          onTextChunk: handleTextChunkFunctionRef,
        }
      : {}),
    onToolCallsChunk: async (toolCalls): Promise<void> => {
      handleTextChunkState = await handleToolCallsChunkFunction(state.uid, assistantMessageId, toolCalls, handleTextChunkState)
    },
    openApiApiBaseUrl,
    openApiApiKey,
    openRouterApiBaseUrl,
    openRouterApiKey,
    passIncludeObfuscation,
    platform,
    ...(typeof questionToolEnabled === 'boolean'
      ? {
          questionToolEnabled,
        }
      : {}),
    selectedModelId,
    streamingEnabled,
    systemPrompt,
    useChatCoordinatorWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useMockApi,
    userText,
    webSearchEnabled,
  })

  const { latestState } = handleTextChunkState
  let finalParsedMessages = latestState.parsedMessages
  let updatedSessions: readonly ChatSession[]
  if (streamingEnabled) {
    const updated = await updateMessageTextInSelectedSession(
      latestState.sessions,
      finalParsedMessages,
      latestState.selectedSessionId,
      assistantMessageId,
      assistantMessage.text,
      false,
    )
    updatedSessions = updated.sessions
    finalParsedMessages = updated.parsedMessages
  } else {
    finalParsedMessages = await parseAndStoreMessageContent(finalParsedMessages, assistantMessage)
    updatedSessions = appendMessageToSelectedSession(latestState.sessions, latestState.selectedSessionId, assistantMessage)
  }
  if (aiSessionTitleGenerationEnabled && createsNewSession) {
    const selectedSession = updatedSessions.find((session) => session.id === latestState.selectedSessionId)
    if (selectedSession && isDefaultSessionTitle(selectedSession.title)) {
      const generatedTitle = await getAiSessionTitle(latestState, userText, assistantMessage.text)
      if (generatedTitle) {
        updatedSessions = updateSessionTitle(updatedSessions, latestState.selectedSessionId, generatedTitle)
      }
    }
  }
  const selectedSession = updatedSessions.find((session) => session.id === latestState.selectedSessionId)
  if (selectedSession) {
    await saveChatSession(selectedSession)
  }
  return withUpdatedMessageScrollTop(
    FocusInput.focusInput({
      ...latestState,
      nextMessageId: latestState.nextMessageId + 1,
      parsedMessages: finalParsedMessages,
      sessions: updatedSessions,
    }),
  )
}
