import type { ChatMessage, ChatSession, ChatState } from '../ChatState/ChatState.ts'

export const openMockSession = (state: ChatState, mockSessionId: string, mockChatMessages: readonly ChatMessage[]): ChatState => {
  if (!mockSessionId) {
    return state
  }

  const existingSession = state.sessions.find((session) => session.id === mockSessionId)
  const sessions: readonly ChatSession[] = existingSession
    ? state.sessions.map((session) => {
        if (session.id !== mockSessionId) {
          return session
        }
        return {
          ...session,
          messages: mockChatMessages,
        }
      })
    : [
        ...state.sessions,
        {
          id: mockSessionId,
          messages: mockChatMessages,
          title: mockSessionId,
        },
      ]

  return {
    ...state,
    renamingSessionId: '',
    selectedSessionId: mockSessionId,
    sessions,
    viewMode: 'detail',
  }
}
