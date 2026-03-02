import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage, ChatSession, ChatState } from '../ChatState/ChatState.ts'
import { getChatSession, saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import * as FocusInput from '../FocusInput/FocusInput.ts'
import { generateSessionId } from '../GenerateSessionId/GenerateSessionId.ts'
import { getAiResponse } from '../GetAiResponse/GetAiResponse.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  const {
    assetDir,
    composerValue,
    mockApiCommandId,
    models,
    nextMessageId,
    openRouterApiBaseUrl,
    openRouterApiKey,
    platform,
    selectedModelId,
    selectedSessionId,
    sessions,
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
      messages: [userMessage],
      title: `Chat ${workingSessions.length + 1}`,
    }
    await saveChatSession(newSession)
    optimisticState = FocusInput.focusInput({
      ...state,
      composerValue: '',
      inputSource: 'script',
      lastSubmittedSessionId: newSessionId,
      nextMessageId: nextMessageId + 1,
      selectedSessionId: newSessionId,
      sessions: [...workingSessions, newSession],
      viewMode: 'detail',
    })
  } else {
    const updatedSessions: readonly ChatSession[] = workingSessions.map((session) => {
      if (session.id !== selectedSessionId) {
        return session
      }
      return {
        ...session,
        messages: [...session.messages, userMessage],
      }
    })
    const selectedSession = updatedSessions.find((session) => session.id === selectedSessionId)
    if (selectedSession) {
      await saveChatSession(selectedSession)
    }
    optimisticState = FocusInput.focusInput({
      ...state,
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

  const selectedOptimisticSession = optimisticState.sessions.find((session) => session.id === optimisticState.selectedSessionId)
  const messages = selectedOptimisticSession?.messages ?? []

  const assistantMessage = await getAiResponse(
    userText,
    messages,
    optimisticState.nextMessageId,
    selectedModelId,
    models,
    openRouterApiKey,
    openRouterApiBaseUrl,
    useMockApi,
    mockApiCommandId,
    assetDir,
    platform,
  )

  const updatedSessions: readonly ChatSession[] = optimisticState.sessions.map((session) => {
    if (session.id !== optimisticState.selectedSessionId) {
      return session
    }
    return {
      ...session,
      messages: [...session.messages, assistantMessage],
    }
  })
  const selectedSession = updatedSessions.find((session) => session.id === optimisticState.selectedSessionId)
  if (selectedSession) {
    await saveChatSession(selectedSession)
  }
  return FocusInput.focusInput({
    ...optimisticState,
    nextMessageId: optimisticState.nextMessageId + 1,
    sessions: updatedSessions,
  })
}
