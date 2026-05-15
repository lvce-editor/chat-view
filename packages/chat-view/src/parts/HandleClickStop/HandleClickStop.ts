import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSessionPreservingMessages } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getChatSessionStatus } from '../GetChatSessionStatus/GetChatSessionStatus.ts'

export const handleClickStop = async (state: ChatState): Promise<ChatState> => {
  const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
  if (!selectedSession || getChatSessionStatus(selectedSession, state.messages) !== 'in-progress') {
    return state
  }
  const messages = state.messages.map((message) => {
    if (message.role !== 'assistant' || !message.inProgress) {
      return message
    }
    return {
      ...message,
      inProgress: false,
    }
  })
  const updatedSelectedSession = {
    ...selectedSession,
    messages,
    status: 'stopped' as const,
  }
  await saveChatSessionPreservingMessages(updatedSelectedSession, messages)
  return {
    ...state,
    messages,
    sessions: state.sessions.map((session) => {
      if (session.id !== updatedSelectedSession.id) {
        return session
      }
      return updatedSelectedSession
    }),
  }
}
