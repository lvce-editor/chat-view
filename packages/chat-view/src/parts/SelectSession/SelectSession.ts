import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getParsedMessagesForSession } from '../ComputeParsedMessages/ComputeParsedMessages.ts'

export const selectSession = async (state: ChatState, id: string): Promise<ChatState> => {
  const exists = state.sessions.some((session) => session.id === id)
  if (!exists) {
    return state
  }
  const loadedSession = await getChatSession(id)
  const sessions = state.sessions.map((session) => {
    if (session.id !== id) {
      return session
    }
    if (!loadedSession) {
      return session
    }
    return loadedSession
  })
  const parsedMessages = await getParsedMessagesForSession(sessions, id, state.useChatMathWorker)
  return {
    ...state,
    lastNormalViewMode: state.viewMode === 'chat-focus' ? state.lastNormalViewMode : 'detail',
    parsedMessages,
    renamingSessionId: '',
    selectedSessionId: id,
    sessions,
    viewMode: state.viewMode === 'chat-focus' ? 'chat-focus' : 'detail',
  }
}
