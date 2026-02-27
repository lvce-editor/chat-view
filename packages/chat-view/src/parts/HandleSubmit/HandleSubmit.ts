import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatMessage, ChatSession, ChatState } from '../ChatState/ChatState.ts'
import * as FocusInput from '../FocusInput/FocusInput.ts'
import { generateSessionId } from '../GenerateSessionId/GenerateSessionId.ts'
import { getAiResponse } from '../GetAiResponse/GetAiResponse.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  const { composerValue, nextMessageId, selectedSessionId, sessions, viewMode } = state
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

  let optimisticState: ChatState
  if (viewMode === 'list') {
    const newSessionId = generateSessionId()
    const newSession: ChatSession = {
      id: newSessionId,
      messages: [userMessage],
      title: `Chat ${sessions.length + 1}`,
    }
    optimisticState = FocusInput.focusInput({
      ...state,
      composerValue: '',
      inputSource: 'script',
      lastSubmittedSessionId: newSessionId,
      nextMessageId: nextMessageId + 1,
      selectedSessionId: newSessionId,
      sessions: [...sessions, newSession],
      viewMode: 'detail',
    })
  } else {
    const updatedSessions: readonly ChatSession[] = sessions.map((session) => {
      if (session.id !== selectedSessionId) {
        return session
      }
      return {
        ...session,
        messages: [...session.messages, userMessage],
      }
    })
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

  const assistantMessage = await getAiResponse(userText, optimisticState.nextMessageId)

  const updatedSessions: readonly ChatSession[] = optimisticState.sessions.map((session) => {
    if (session.id !== optimisticState.selectedSessionId) {
      return session
    }
    return {
      ...session,
      messages: [...session.messages, assistantMessage],
    }
  })
  return FocusInput.focusInput({
    ...optimisticState,
    nextMessageId: optimisticState.nextMessageId + 1,
    sessions: updatedSessions,
  })
}
