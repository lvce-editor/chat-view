import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage, ChatSession, ChatState } from '../ChatState/ChatState.ts'
import * as ActiveChatRequests from '../ActiveChatRequests/ActiveChatRequests.ts'
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

const withUpdatedMessageScrollTop = (state: ChatState): ChatState => {
  if (!state.messagesAutoScrollEnabled) {
    return state
  }
  return {
    ...state,
    messagesScrollTop: getNextAutoScrollTop(state.messagesScrollTop),
  }
}

const isAbortError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false
  }
  return Reflect.get(error, 'name') === 'AbortError'
}

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  const {
    aiSessionTitleGenerationEnabled,
    assetDir,
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
    selectedModelId,
    selectedSessionId,
    sessions,
    streamingEnabled,
    useChatCoordinatorWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useMockApi,
    viewMode,
    webSearchEnabled,
  } = state
  if (state.requestInProgress) {
    return state
  }
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
        requestInProgress: true,
        selectedSessionId: newSessionId,
        sessions: [...workingSessions, newSession],
        viewMode: 'detail',
      }),
    )
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
        requestInProgress: true,
        sessions: updatedSessions,
      }),
    )
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

  const abortSignal = ActiveChatRequests.create(state.uid)
  try {
    const assistantMessage = await getAiResponse({
      abortSignal,
      assetDir,
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
      selectedModelId,
      streamingEnabled,
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
        requestInProgress: false,
        sessions: updatedSessions,
      }),
    )
  } catch (error) {
    if (!isAbortError(error)) {
      throw error
    }
    const { latestState } = handleTextChunkState
    const updated = await updateMessageTextInSelectedSession(
      latestState.sessions,
      latestState.parsedMessages,
      latestState.selectedSessionId,
      assistantMessageId,
      latestState.sessions
        .find((session) => session.id === latestState.selectedSessionId)
        ?.messages.find((message) => message.id === assistantMessageId)?.text ?? '',
      false,
    )
    return {
      ...latestState,
      parsedMessages: updated.parsedMessages,
      requestInProgress: false,
      sessions: updated.sessions,
    }
  } finally {
    ActiveChatRequests.clear(state.uid)
  }
}
