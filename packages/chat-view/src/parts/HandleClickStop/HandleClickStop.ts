import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSessionPreservingMessages } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getChatSessionStatus } from '../GetChatSessionStatus/GetChatSessionStatus.ts'

export const handleClickStop = async (state: ChatState): Promise<ChatState> => {
  const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
  const selectedMessages = state.messages.length > 0 ? state.messages : selectedSession?.messages || []
  if (!selectedSession || getChatSessionStatus(selectedSession, selectedMessages) !== 'in-progress') {
    return state
  }
  const messages = selectedMessages.map((message) => {
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
  const updatedSelectedSessionSummary = {
    ...selectedSession,
    messages: [],
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
      return updatedSelectedSessionSummary
    }),
  }
}
