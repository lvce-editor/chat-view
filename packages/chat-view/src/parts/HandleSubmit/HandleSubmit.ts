/* cspell:words worktrees */

import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { appendMessageToSelectedSession } from '../AppendMessageToSelectedSession/AppendMessageToSelectedSession.ts'
import { syncBackendAuth } from '../BackendAuth/BackendAuth.ts'
import { appendChatViewEvent, getChatSession, saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { createBackgroundChatWorktree } from '../CreateBackgroundChatWorktree/CreateBackgroundChatWorktree.ts'
import { executeSlashCommand } from '../ExecuteSlashCommand/ExecuteSlashCommand.ts'
import * as FocusInput from '../FocusInput/FocusInput.ts'
import { generateSessionId } from '../GenerateSessionId/GenerateSessionId.ts'
import { getAiResponse } from '../GetAiResponse/GetAiResponse.ts'
import { getAiSessionTitle } from '../GetAiSessionTitle/GetAiSessionTitle.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
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

const workspaceUriPlaceholder = '{{workspaceUri}}'

const clearComposerAttachments = async (sessionId: string, attachmentIds: readonly string[]): Promise<void> => {
  if (!sessionId) {
    return
  }
  for (const attachmentId of attachmentIds) {
    await appendChatViewEvent({
      attachmentId,
      sessionId,
      timestamp: new Date().toISOString(),
      type: 'chat-attachment-removed',
    })
  }
}

const getCurrentDate = (): string => {
  return new Date().toISOString().slice(0, 10)
}

const getProjectUri = (state: ChatState, projectId: string): string => {
  return state.projects.find((project) => project.id === projectId)?.uri || ''
}

const getWorkspaceUri = (state: ChatState, session: ChatSession | undefined): string => {
  if (session?.workspaceUri) {
    return session.workspaceUri
  }
  return getProjectUri(state, session?.projectId || state.selectedProjectId)
}

const getEffectiveSystemPrompt = (state: ChatState, session: ChatSession | undefined): string => {
  const resolvedSystemPrompt = state.systemPrompt.replaceAll(workspaceUriPlaceholder, getWorkspaceUri(state, session) || 'unknown')
  const currentDateInstructions = `Current date: ${getCurrentDate()}.

Do not assume your knowledge cutoff is the same as the current date.`
  if (!resolvedSystemPrompt) {
    return currentDateInstructions
  }
  return `${resolvedSystemPrompt}

${currentDateInstructions}`
}

const withProvisionedBackgroundSession = async (state: ChatState, session: ChatSession): Promise<ChatSession> => {
  if (state.runMode !== 'background' || session.workspaceUri) {
    return session
  }
  const { branchName, workspaceUri } = await createBackgroundChatWorktree({
    assetDir: state.assetDir,
    platform: state.platform,
    projectUri: getProjectUri(state, session.projectId || state.selectedProjectId),
    sessionId: session.id,
    title: session.title,
  })
  return {
    ...session,
    branchName,
    workspaceUri,
  }
}

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  const authState = state.authEnabled && state.backendUrl ? await syncBackendAuth(state.backendUrl) : undefined
  const effectiveState = authState
    ? {
        ...state,
        ...authState,
      }
    : state
  const {
    agentMode,
    aiSessionTitleGenerationEnabled,
    assetDir,
    authAccessToken,
    authEnabled,
    backendUrl,
    composerValue,
    emitStreamingFunctionCallEvents,
    maxToolCalls,
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
    reasoningEffort,
    selectedModelId,
    selectedSessionId,
    sessions,
    streamingEnabled,
    toolEnablement,
    useChatCoordinatorWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useMockApi,
    viewMode,
    webSearchEnabled,
  } = effectiveState
  const userText = composerValue.trim()
  if (!userText) {
    return effectiveState
  }

  const slashCommand = getSlashCommand(userText)
  if (slashCommand) {
    return executeSlashCommand(effectiveState, slashCommand)
  }

  const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const userMessageId = crypto.randomUUID()
  const composerAttachments =
    effectiveState.composerAttachments.length > 0
      ? effectiveState.composerAttachments
      : await getComposerAttachments(effectiveState.selectedSessionId)
  await clearComposerAttachments(
    effectiveState.selectedSessionId,
    composerAttachments.map((attachment) => attachment.attachmentId),
  )
  const userMessage: ChatMessage = {
    ...(composerAttachments.length > 0
      ? {
          attachments: composerAttachments,
        }
      : {}),
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
  let { parsedMessages } = effectiveState
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
      projectId: state.selectedProjectId,
      title: `Chat ${workingSessions.length + 1}`,
    }
    const provisionedSession = await withProvisionedBackgroundSession(state, newSession)
    await saveChatSession(provisionedSession)
    optimisticState = withUpdatedMessageScrollTop(
      FocusInput.focusInput({
        ...effectiveState,
        composerAttachments: [],
        composerAttachmentsHeight: 0,
        composerHeight: getMinComposerHeightForState(effectiveState),
        composerSelectionEnd: 0,
        composerSelectionStart: 0,
        composerValue: '',
        inputSource: 'script',
        lastSubmittedSessionId: newSessionId,
        nextMessageId: nextMessageId + 1,
        parsedMessages,
        selectedProjectId: provisionedSession.projectId || state.selectedProjectId,
        selectedSessionId: newSessionId,
        sessions: [...workingSessions, provisionedSession],
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
    const loadedSelectedSession = workingSessions.find((session) => session.id === selectedSessionId)
    const provisionedSelectedSession = loadedSelectedSession ? await withProvisionedBackgroundSession(state, loadedSelectedSession) : undefined
    const workingSessionsWithProvisionedSession = provisionedSelectedSession
      ? workingSessions.map((session) => {
          if (session.id !== selectedSessionId) {
            return session
          }
          return provisionedSelectedSession
        })
      : workingSessions
    const updatedWithUser = appendMessageToSelectedSession(workingSessionsWithProvisionedSession, selectedSessionId, userMessage)
    const updatedSessions = streamingEnabled
      ? appendMessageToSelectedSession(updatedWithUser, selectedSessionId, inProgressAssistantMessage)
      : updatedWithUser
    const selectedSession = updatedSessions.find((session) => session.id === selectedSessionId)
    if (selectedSession) {
      await saveChatSession(selectedSession)
    }
    optimisticState = withUpdatedMessageScrollTop(
      FocusInput.focusInput({
        ...effectiveState,
        composerAttachments: [],
        composerAttachmentsHeight: 0,
        composerHeight: getMinComposerHeightForState(effectiveState),
        composerSelectionEnd: 0,
        composerSelectionStart: 0,
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

  set(effectiveState.uid, effectiveState, optimisticState)
  // @ts-ignore
  await RendererWorker.invoke('Chat.rerender')

  let handleTextChunkState: HandleTextChunkState = {
    latestState: optimisticState,
    previousState: optimisticState,
  }
  let { mockOpenApiRequests } = optimisticState
  const selectedOptimisticSession = optimisticState.sessions.find((session) => session.id === optimisticState.selectedSessionId)
  const systemPrompt = getEffectiveSystemPrompt(optimisticState, selectedOptimisticSession)
  const workspaceUri = getWorkspaceUri(optimisticState, selectedOptimisticSession)
  const messages = (selectedOptimisticSession?.messages ?? []).filter((message) => !message.inProgress)
  const mentionContextMessage = await getMentionContextMessage(userText)
  const messagesWithMentionContext = mentionContextMessage ? [...messages, mentionContextMessage] : messages

  const handleTextChunkFunctionRef = streamingEnabled
    ? async (chunk: string): Promise<void> => {
        handleTextChunkState = await handleTextChunkFunction(state.uid, assistantMessageId, chunk, handleTextChunkState)
      }
    : undefined

  const assistantMessage = await getAiResponse({
    agentMode,
    assetDir,
    authAccessToken,
    authEnabled,
    backendUrl,
    maxToolCalls,
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
    onMockOpenApiRequestCaptured: async (request): Promise<void> => {
      mockOpenApiRequests = [...mockOpenApiRequests, request]
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
    reasoningEffort,
    selectedModelId,
    streamingEnabled,
    systemPrompt,
    toolEnablement,
    useChatCoordinatorWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useMockApi,
    userText,
    webSearchEnabled,
    workspaceUri,
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
      mockOpenApiRequests,
      nextMessageId: latestState.nextMessageId + 1,
      parsedMessages: finalParsedMessages,
      sessions: updatedSessions,
    }),
  )
}
