import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage, ChatSession, ChatState } from '../ChatState/ChatState.ts'
import { appendChatViewEvent, getChatSession, saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import * as FocusInput from '../FocusInput/FocusInput.ts'
import { generateSessionId } from '../GenerateSessionId/GenerateSessionId.ts'
import { getAiResponse } from '../GetAiResponse/GetAiResponse.ts'
import { getMinComposerHeightForState } from '../GetComposerHeight/GetComposerHeight.ts'
import {
  handleToolCallsChunkFunction,
  handleTextChunkFunction,
  type HandleTextChunkState,
  updateMessageTextInSelectedSession,
} from '../HandleTextChunkFunction/HandleTextChunkFunction.ts'
import { isOpenApiModel } from '../IsOpenApiModel/IsOpenApiModel.ts'
import { isOpenRouterModel } from '../IsOpenRouterModel/IsOpenRouterModel.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

const appendMessageToSelectedSession = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  message: ChatMessage,
): readonly ChatSession[] => {
  return sessions.map((session) => {
    if (session.id !== selectedSessionId) {
      return session
    }
    return {
      ...session,
      messages: [...session.messages, message],
    }
  })
}

const hasLegacyStreamingToolCalls = (parsed: unknown): boolean => {
  if (!parsed || typeof parsed !== 'object') {
    return false
  }
  const choices = Reflect.get(parsed, 'choices')
  if (!Array.isArray(choices) || choices.length === 0) {
    return false
  }
  const firstChoice = choices[0]
  if (!firstChoice || typeof firstChoice !== 'object') {
    return false
  }
  const delta = Reflect.get(firstChoice, 'delta')
  if (!delta || typeof delta !== 'object') {
    return false
  }
  const toolCalls = Reflect.get(delta, 'tool_calls')
  return Array.isArray(toolCalls) && toolCalls.length > 0
}

const isStreamingFunctionCallEvent = (parsed: unknown): boolean => {
  if (hasLegacyStreamingToolCalls(parsed)) {
    return true
  }
  if (!parsed || typeof parsed !== 'object') {
    return false
  }
  const type = Reflect.get(parsed, 'type')
  if (type === 'response.function_call_arguments.delta' || type === 'response.function_call_arguments.done') {
    return true
  }
  if (type !== 'response.output_item.added' && type !== 'response.output_item.done') {
    return false
  }
  const item = Reflect.get(parsed, 'item')
  if (!item || typeof item !== 'object') {
    return false
  }
  return Reflect.get(item, 'type') === 'function_call'
}

const getSseEventType = (value: unknown): 'sse-response-completed' | 'sse-response-part' => {
  return value && typeof value === 'object' && Reflect.get(value, 'type') === 'response.completed' ? 'sse-response-completed' : 'sse-response-part'
}

const isDefaultSessionTitle = (title: string): boolean => {
  return /^Chat \d+$/.test(title)
}

const sanitizeGeneratedTitle = (value: string): string => {
  return value.replace(/^title:\s*/i, '').replace(/^['"`\s]+|['"`\s]+$/g, '').replace(/\s+/g, ' ').trim().slice(0, 80)
}

const updateSessionTitle = (sessions: readonly ChatSession[], selectedSessionId: string, title: string): readonly ChatSession[] => {
  return sessions.map((session) => {
    if (session.id !== selectedSessionId) {
      return session
    }
    return {
      ...session,
      title,
    }
  })
}

const getAiSessionTitle = async (
  state: ChatState,
  userText: string,
  assistantText: string,
): Promise<string> => {
  const { models, openApiApiBaseUrl, openApiApiKey, openRouterApiBaseUrl, openRouterApiKey, selectedModelId, useMockApi } = state
  if (useMockApi) {
    return ''
  }
  const usesOpenApiModel = isOpenApiModel(selectedModelId, models)
  const usesOpenRouterModel = isOpenRouterModel(selectedModelId, models)
  if (usesOpenApiModel && !openApiApiKey) {
    return ''
  }
  if (usesOpenRouterModel && !openRouterApiKey) {
    return ''
  }
  if (!usesOpenApiModel && !usesOpenRouterModel) {
    return ''
  }

  const titlePrompt = `Create a concise title (max 6 words) for this conversation. Respond only with the title, no punctuation at the end.
User: ${userText}
Assistant: ${assistantText}`
  const promptMessage = {
    id: crypto.randomUUID(),
    role: 'user' as const,
    text: titlePrompt,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
  const titleResponse = await getAiResponse({
    assetDir: state.assetDir,
    messages: [promptMessage],
    mockAiResponseDelay: state.mockAiResponseDelay,
    mockApiCommandId: state.mockApiCommandId,
    models,
    nextMessageId: state.nextMessageId,
    openApiApiBaseUrl,
    openApiApiKey,
    openRouterApiBaseUrl,
    openRouterApiKey,
    passIncludeObfuscation: state.passIncludeObfuscation,
    platform: state.platform,
    selectedModelId,
    streamingEnabled: false,
    useMockApi,
    userText: titlePrompt,
    webSearchEnabled: false,
  })
  const title = sanitizeGeneratedTitle(titleResponse.text)
  return title && !isDefaultSessionTitle(title) ? title : ''
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
    useMockApi,
    viewMode,
    webSearchEnabled,
  } = state
  const userText = composerValue.trim()
  if (!userText) {
    return state
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
    optimisticState = FocusInput.focusInput({
      ...state,
      composerHeight: getMinComposerHeightForState(state),
      composerValue: '',
      inputSource: 'script',
      lastSubmittedSessionId: newSessionId,
      nextMessageId: nextMessageId + 1,
      selectedSessionId: newSessionId,
      sessions: [...workingSessions, newSession],
      viewMode: 'detail',
    })
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
    optimisticState = FocusInput.focusInput({
      ...state,
      composerHeight: getMinComposerHeightForState(state),
      composerValue: '',
      inputSource: 'script',
      lastSubmittedSessionId: selectedSessionId,
      nextMessageId: nextMessageId + 1,
      sessions: updatedSessions,
    })
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

  const handleTextChunkFunctionRef = streamingEnabled
    ? async (chunk: string): Promise<void> => {
        handleTextChunkState = await handleTextChunkFunction(state.uid, assistantMessageId, chunk, handleTextChunkState)
      }
    : undefined

  const assistantMessage = await getAiResponse({
    assetDir,
    messageId: assistantMessageId,
    messages,
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
    useMockApi,
    userText,
    webSearchEnabled,
  })

  const { latestState } = handleTextChunkState
  let updatedSessions = streamingEnabled
    ? updateMessageTextInSelectedSession(latestState.sessions, latestState.selectedSessionId, assistantMessageId, assistantMessage.text, false)
    : appendMessageToSelectedSession(latestState.sessions, latestState.selectedSessionId, assistantMessage)
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
  return FocusInput.focusInput({
    ...latestState,
    nextMessageId: latestState.nextMessageId + 1,
    sessions: updatedSessions,
  })
}
