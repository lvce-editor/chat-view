import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage, ChatQueuedMessage, ChatSession, ChatState } from '../ChatState/ChatState.ts'
import { appendMessageToSelectedSession } from '../AppendMessageToSelectedSession/AppendMessageToSelectedSession.ts'
import { appendChatViewEvent, getChatSession, saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { openApiApiKeyRequiredMessage, openRouterApiKeyRequiredMessage } from '../chatViewStrings/chatViewStrings.ts'
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
import { get, set } from '../StatusBarStates/StatusBarStates.ts'
import { updateSessionTitle } from '../UpdateSessionTitle/UpdateSessionTitle.ts'

interface SubmitResult {
  readonly state: ChatState
  readonly stopQueue: boolean
}

interface SubmitPreparation {
  readonly assistantMessageId: string
  readonly createsNewSession: boolean
  readonly optimisticState: ChatState
  readonly requestSessionId: string
}

const withUpdatedMessageScrollTop = (state: ChatState): ChatState => {
  if (!state.messagesAutoScrollEnabled) {
    return state
  }
  return {
    ...state,
    messagesScrollTop: getNextAutoScrollTop(state.messagesScrollTop),
  }
}

const hasInProgressRequest = (state: ChatState): boolean => {
  if (state.submitInProgress) {
    return true
  }
  return state.sessions.some((session) => session.messages.some((message) => message.inProgress))
}

const shouldStopQueue = (assistantText: string): boolean => {
  return assistantText === openApiApiKeyRequiredMessage || assistantText === openRouterApiKeyRequiredMessage
}

const getLatestState = (uid: number, fallbackState: ChatState): ChatState => {
  if (!uid) {
    return fallbackState
  }
  const entry = get(uid)
  return entry?.newState || fallbackState
}

const rerenderState = async (uid: number, oldState: ChatState, newState: ChatState): Promise<void> => {
  if (!uid) {
    return
  }
  set(uid, oldState, newState)
  // @ts-ignore
  await RendererWorker.invoke('Chat.rerender')
}

const createQueuedMessage = (userText: string, sessionId: string): ChatQueuedMessage => {
  return {
    id: crypto.randomUUID(),
    queued: true,
    role: 'user',
    sessionId,
    text: userText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

const enqueueMessage = async (state: ChatState, userText: string): Promise<ChatState> => {
  const queuedMessage = createQueuedMessage(userText, state.selectedSessionId)
  const parsedMessages = await parseAndStoreMessageContent(state.parsedMessages, queuedMessage)
  const queuedState = withUpdatedMessageScrollTop(
    FocusInput.focusInput({
      ...state,
      composerHeight: getMinComposerHeightForState(state),
      composerValue: '',
      inputSource: 'script',
      parsedMessages,
      queuedMessages: [...state.queuedMessages, queuedMessage],
    }),
  )
  set(state.uid, state, queuedState)
  // @ts-ignore
  await RendererWorker.invoke('Chat.rerender')
  return queuedState
}

const prepareSubmit = async (state: ChatState, userText: string): Promise<SubmitPreparation> => {
  const {
    nextMessageId,
    selectedSessionId,
    sessions,
    streamingEnabled,
    viewMode,
  } = state

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
        submitInProgress: true,
        viewMode: 'detail',
      }),
    )
    return {
      assistantMessageId,
      createsNewSession,
      optimisticState,
      requestSessionId: newSessionId,
    }
  }

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
      submitInProgress: true,
    }),
  )
  return {
    assistantMessageId,
    createsNewSession,
    optimisticState,
    requestSessionId: selectedSessionId,
  }
}

const submitSingle = async (state: ChatState, userText: string): Promise<SubmitResult> => {
  const {
    aiSessionTitleGenerationEnabled,
    assetDir,
    authAccessToken,
    authEnabled,
    backendUrl,
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
    useChatCoordinatorWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useMockApi,
    viewMode,
    webSearchEnabled,
  } = state

  const slashCommand = getSlashCommand(userText)
  if (slashCommand) {
    return {
      state: await executeSlashCommand(state, slashCommand),
      stopQueue: false,
    }
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
        submitInProgress: true,
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
        sessions: updatedSessions,
        submitInProgress: true,
      }),
    )
  }

  set(state.uid, state, optimisticState)
  // @ts-ignore
  await RendererWorker.invoke('Chat.rerender')

  return completeSubmit(optimisticState, userText, assistantMessageId, createsNewSession, optimisticState.selectedSessionId)
}

const completeSubmit = async (
  optimisticState: ChatState,
  userText: string,
  assistantMessageId: string,
  createsNewSession: boolean,
  requestSessionId: string,
): Promise<SubmitResult> => {
  const {
    aiSessionTitleGenerationEnabled,
    assetDir,
    authAccessToken,
    authEnabled,
    backendUrl,
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
    streamingEnabled,
    useChatCoordinatorWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useMockApi,
    viewMode,
    webSearchEnabled,
  } = optimisticState

  let handleTextChunkState: HandleTextChunkState = {
    latestState: optimisticState,
    previousState: optimisticState,
    requestSessionId,
  }
  const selectedOptimisticSession = optimisticState.sessions.find((session) => session.id === requestSessionId)
  const messages = (selectedOptimisticSession?.messages ?? []).filter((message) => !message.inProgress)
  const mentionContextMessage = await getMentionContextMessage(userText)
  const messagesWithMentionContext = mentionContextMessage ? [...messages, mentionContextMessage] : messages

  const handleTextChunkFunctionRef = streamingEnabled
    ? async (chunk: string): Promise<void> => {
        handleTextChunkState = await handleTextChunkFunction(optimisticState.uid, assistantMessageId, chunk, handleTextChunkState)
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
    nextMessageId,
    onDataEvent: async (value: unknown): Promise<void> => {
      if (!emitStreamingFunctionCallEvents && isStreamingFunctionCallEvent(value)) {
        return
      }
      const sseEventType = getSseEventType(value)
      await appendChatViewEvent({
        sessionId: requestSessionId,
        timestamp: new Date().toISOString(),
        type: sseEventType,
        value,
      })
    },
    onEventStreamFinished: async (): Promise<void> => {
      await appendChatViewEvent({
        sessionId: requestSessionId,
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
      handleTextChunkState = await handleToolCallsChunkFunction(optimisticState.uid, assistantMessageId, toolCalls, handleTextChunkState)
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
    useChatCoordinatorWorker,
    useChatNetworkWorkerForRequests,
    useChatToolWorker,
    useMockApi,
    userText,
    webSearchEnabled,
  })

  const { latestState } = handleTextChunkState
  const currentState = getLatestState(latestState.uid, latestState)
  let finalParsedMessages = currentState.parsedMessages
  let updatedSessions: readonly ChatSession[]
  if (streamingEnabled) {
    const updated = await updateMessageTextInSelectedSession(
      currentState.sessions,
      finalParsedMessages,
      requestSessionId,
      assistantMessageId,
      assistantMessage.text,
      false,
    )
    updatedSessions = updated.sessions
    finalParsedMessages = updated.parsedMessages
  } else {
    finalParsedMessages = await parseAndStoreMessageContent(finalParsedMessages, assistantMessage)
    updatedSessions = appendMessageToSelectedSession(currentState.sessions, requestSessionId, assistantMessage)
  }
  if (aiSessionTitleGenerationEnabled && createsNewSession) {
    const selectedSession = updatedSessions.find((session) => session.id === requestSessionId)
    if (selectedSession && isDefaultSessionTitle(selectedSession.title)) {
      const generatedTitle = await getAiSessionTitle(currentState, userText, assistantMessage.text)
      if (generatedTitle) {
        updatedSessions = updateSessionTitle(updatedSessions, requestSessionId, generatedTitle)
      }
    }
  }
  const selectedSession = updatedSessions.find((session) => session.id === requestSessionId)
  if (selectedSession) {
    await saveChatSession(selectedSession)
  }
  const latestGlobalState = getLatestState(currentState.uid, currentState)
  return {
    state: withUpdatedMessageScrollTop(
      FocusInput.focusInput({
        ...latestGlobalState,
        nextMessageId: latestGlobalState.nextMessageId + 1,
        parsedMessages: finalParsedMessages,
        sessions: updatedSessions,
        submitInProgress: false,
      }),
    ),
    stopQueue: shouldStopQueue(assistantMessage.text),
  }
}

const continueSubmitInBackground = async (preparation: SubmitPreparation, userText: string): Promise<void> => {
  const result = await completeSubmit(
    preparation.optimisticState,
    userText,
    preparation.assistantMessageId,
    preparation.createsNewSession,
    preparation.requestSessionId,
  )
  const settledState = result.stopQueue
    ? {
        ...result.state,
        queuedMessages: [],
      }
    : result.state
  const latestState = getLatestState(settledState.uid, preparation.optimisticState)
  await rerenderState(settledState.uid, latestState, settledState)
  if (result.stopQueue || settledState.queuedMessages.length === 0) {
    return
  }
  await processQueuedMessagesInBackground(settledState)
}

const processQueuedMessagesInBackground = async (state: ChatState): Promise<void> => {
  let currentState = state
  while (currentState.queuedMessages.length > 0) {
    const nextQueued = currentState.queuedMessages[0]
    const queueState: ChatState = {
      ...currentState,
      queuedMessages: currentState.queuedMessages.slice(1),
      selectedSessionId: nextQueued.sessionId,
      viewMode: 'detail',
    }
    const preparation = await prepareSubmit(queueState, nextQueued.text)
    await rerenderState(queueState.uid, currentState, preparation.optimisticState)
    const result = await completeSubmit(
      preparation.optimisticState,
      nextQueued.text,
      preparation.assistantMessageId,
      preparation.createsNewSession,
      preparation.requestSessionId,
    )
    const settledState = result.stopQueue
      ? {
          ...result.state,
          queuedMessages: [],
        }
      : result.state
    const latestState = getLatestState(settledState.uid, preparation.optimisticState)
    await rerenderState(settledState.uid, latestState, settledState)
    if (result.stopQueue) {
      return
    }
    currentState = settledState
  }
}

const drainQueue = async (state: ChatState): Promise<ChatState> => {
  let currentState = state
  while (currentState.queuedMessages.length > 0) {
    const nextQueued = currentState.queuedMessages[0]
    const queueState: ChatState = {
      ...currentState,
      queuedMessages: currentState.queuedMessages.slice(1),
      selectedSessionId: nextQueued.sessionId,
      viewMode: 'detail',
    }
    const result = await submitSingle(queueState, nextQueued.text)
    if (result.stopQueue) {
      return {
        ...result.state,
        queuedMessages: [],
      }
    }
    currentState = result.state
  }
  return currentState
}

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  const userText = state.composerValue.trim()
  if (!userText) {
    return state
  }
  if (hasInProgressRequest(state)) {
    return enqueueMessage(state, userText)
  }
  const slashCommand = getSlashCommand(userText)
  if (slashCommand) {
    return executeSlashCommand(state, slashCommand)
  }
  if (state.uid) {
    const preparation = await prepareSubmit(state, userText)
    queueMicrotask(() => {
      void continueSubmitInBackground(preparation, userText)
    })
    return preparation.optimisticState
  }
  const result = await submitSingle(state, userText)
  if (result.stopQueue || result.state.queuedMessages.length === 0) {
    return result.stopQueue
      ? {
          ...result.state,
          queuedMessages: [],
        }
      : result.state
  }
  return drainQueue(result.state)
}
