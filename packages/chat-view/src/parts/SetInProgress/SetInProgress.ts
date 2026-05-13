import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'

export const setInProgress = async (state: ChatState, inProgress: boolean): Promise<ChatState> => {
  const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
  if (!selectedSession) {
    return state
  }

  const lastAssistantMessageIndex = selectedSession.messages.findLastIndex((message) => message.role === 'assistant')
  if (lastAssistantMessageIndex === -1) {
    return state
  }

  const messages = selectedSession.messages.map((message, index) => {
    if (index !== lastAssistantMessageIndex) {
      return message
    }
    return {
      ...message,
      inProgress,
    }
  })

  const updatedSelectedSession = {
    ...selectedSession,
    messages,
    status: inProgress ? ('in-progress' as const) : ('finished' as const),
  }

  await saveChatSession(updatedSelectedSession)

  return {
    ...state,
    sessions: state.sessions.map((session) => {
      if (session.id !== selectedSession.id) {
        return session
      }
      return updatedSelectedSession
    }),
  }
}
