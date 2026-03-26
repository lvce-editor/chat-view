import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { parseAndStoreMessagesContentWithWorkerPreference } from '../ParsedMessageContent/ParsedMessageContent.ts'

export const openMockSession = async (state: ChatState, mockSessionId: string, mockChatMessages: readonly ChatMessage[]): Promise<ChatState> => {
  const { sessions: currentSessions } = state

  if (!mockSessionId) {
    return state
  }
  const parsedMessages = await parseAndStoreMessagesContentWithWorkerPreference(
    state.parsedMessages,
    mockChatMessages,
    state.useChatMessageParsingWorker,
  )

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
    composerAttachments: [],
    parsedMessages,
    renamingSessionId: '',
    selectedSessionId: mockSessionId,
    sessions,
    viewMode: 'detail',
  }
}
