import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getChatSessionStatus } from '../GetChatSessionStatus/GetChatSessionStatus.ts'

export const handleClickStop = async (state: ChatState): Promise<ChatState> => {
  const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
  if (!selectedSession || getChatSessionStatus(selectedSession) !== 'in-progress') {
    return state
  }
  const updatedSelectedSession = {
    ...selectedSession,
    messages: selectedSession.messages.map((message) => {
      if (message.role !== 'assistant' || !message.inProgress) {
        return message
      }
      return {
        ...message,
        inProgress: false,
      }
    }),
    status: 'stopped' as const,
  }
  await saveChatSession(updatedSelectedSession)
  return {
    ...state,
    sessions: state.sessions.map((session) => {
      if (session.id !== updatedSelectedSession.id) {
        return session
      }
      return updatedSelectedSession
    }),
  }
}
