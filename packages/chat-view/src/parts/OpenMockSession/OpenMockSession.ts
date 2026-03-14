import type { ChatMessage, ChatSession, ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getParsedMessagesForSession } from '../ComputeParsedMessages/ComputeParsedMessages.ts'

export const openMockSession = async (state: ChatState, mockSessionId: string, mockChatMessages: readonly ChatMessage[]): Promise<ChatState> => {
  const { sessions: currentSessions } = state

  if (!mockSessionId) {
    return state
  }

  const existingSession = currentSessions.find((session) => session.id === mockSessionId)
  const sessions: readonly ChatSession[] = existingSession
    ? currentSessions.map((session) => {
        if (session.id !== mockSessionId) {
          return session
        }
        return {
          ...session,
          messages: mockChatMessages,
        }
      })
    : [
        ...currentSessions,
        {
          id: mockSessionId,
          messages: mockChatMessages,
          title: mockSessionId,
        },
      ]

  const selectedSession = sessions.find((session) => session.id === mockSessionId)
  if (selectedSession) {
    await saveChatSession(selectedSession)
  }

  return {
    ...state,
    parsedMessages: await getParsedMessagesForSession(sessions, mockSessionId, state.useChatMathWorker),
    renamingSessionId: '',
    selectedSessionId: mockSessionId,
    sessions,
    viewMode: 'detail',
  }
}
