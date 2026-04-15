import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'

const togglePinned = (session: ChatSession): ChatSession => {
  if (session.pinned) {
    return {
      ...session,
      pinned: false,
    }
  }
  return {
    ...session,
    pinned: true,
  }
}

export const toggleSessionPinned = async (state: ChatState, sessionId: string): Promise<ChatState> => {
  if (!state.sessionPinningEnabled) {
    return state
  }
  const session = state.sessions.find((item) => item.id === sessionId)
  if (!session) {
    return state
  }
  const updatedSession = togglePinned(session)
  const sessions = state.sessions.map((item) => {
    if (item.id !== sessionId) {
      return item
    }
    return updatedSession
  })
  await saveChatSession(updatedSession)
  return {
    ...state,
    sessions,
  }
}
