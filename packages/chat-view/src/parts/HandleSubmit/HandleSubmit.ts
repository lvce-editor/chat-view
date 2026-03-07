import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage, ChatSession, ChatState } from '../ChatState/ChatState.ts'
import { getChatSession, saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import * as FocusInput from '../FocusInput/FocusInput.ts'
import { generateSessionId } from '../GenerateSessionId/GenerateSessionId.ts'
import { getAiResponse } from '../GetAiResponse/GetAiResponse.ts'
import { getMinComposerHeightForState } from '../GetComposerHeight/GetComposerHeight.ts'
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

const updateMessageTextInSelectedSession = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  messageId: string,
  text: string,
  inProgress: boolean,
): readonly ChatSession[] => {
  return sessions.map((session) => {
    if (session.id !== selectedSessionId) {
      return session
    }
    return {
      ...session,
      messages: session.messages.map((message) => {
        if (message.id !== messageId) {
          return message
        }
        return {
          ...message,
          inProgress,
          text,
        }
      }),
    }
  })
}

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  const {
    assetDir,
    composerValue,
    mockApiCommandId,
    models,
    nextMessageId,
    openApiApiBaseUrl,
    openApiApiKey,
    openRouterApiBaseUrl,
    openRouterApiKey,
    platform,
    selectedModelId,
    selectedSessionId,
    sessions,
    streamingEnabled,
    useMockApi,
    viewMode,
  } = state
  const userText = composerValue.trim()
  if (!userText) {
    return state
  }
  const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const userMessage: ChatMessage = {
    id: `message-${nextMessageId}`,
    role: 'user',
    text: userText,
    time: userTime,
  }
  const assistantMessageId = `message-${nextMessageId + 1}`
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
  if (viewMode === 'list') {
    const newSessionId = generateSessionId()
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

  let latestState = optimisticState
  let previousState = optimisticState
  const selectedOptimisticSession = latestState.sessions.find((session) => session.id === latestState.selectedSessionId)
  const messages = (selectedOptimisticSession?.messages ?? []).filter((message) => !message.inProgress)

  const onTextChunk = streamingEnabled
    ? async (chunk: string): Promise<void> => {
        const selectedSession = latestState.sessions.find((session) => session.id === latestState.selectedSessionId)
        if (!selectedSession) {
          return
        }
        const assistantMessage = selectedSession.messages.find((message) => message.id === assistantMessageId)
        if (!assistantMessage) {
          return
        }
        const updatedText = assistantMessage.text + chunk
        const updatedSessions = updateMessageTextInSelectedSession(
          latestState.sessions,
          latestState.selectedSessionId,
          assistantMessageId,
          updatedText,
          true,
        )
        const nextState = {
          ...latestState,
          sessions: updatedSessions,
        }
        set(state.uid, previousState, nextState)
        previousState = nextState
        latestState = nextState
        // @ts-ignore
        await RendererWorker.invoke('Chat.rerender')
      }
    : undefined

  const assistantMessage = await getAiResponse({
    assetDir,
    messages,
    mockApiCommandId,
    models,
    nextMessageId: optimisticState.nextMessageId,
    onTextChunk,
    openApiApiBaseUrl,
    openApiApiKey,
    openRouterApiBaseUrl,
    openRouterApiKey,
    platform,
    selectedModelId,
    streamingEnabled,
    useMockApi,
    userText,
  })

  const updatedSessions = streamingEnabled
    ? updateMessageTextInSelectedSession(latestState.sessions, latestState.selectedSessionId, assistantMessageId, assistantMessage.text, false)
    : appendMessageToSelectedSession(latestState.sessions, latestState.selectedSessionId, assistantMessage)
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
