import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSessionPreservingMessages } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const handleClickChatListMarkAllAsRead = async (state: ChatState): Promise<ChatState> => {
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId)
  if (visibleSessions.length === 0) {
    return state
  }
  const visibleSessionIds = new Set(visibleSessions.map((session) => session.id))
  const nextSessions = state.sessions.map((session) => {
    if (!visibleSessionIds.has(session.id)) {
      return session
    }
    return {
      ...session,
      unread: false,
    }
  })
  for (const session of nextSessions) {
    if (!visibleSessionIds.has(session.id)) {
      continue
    }
    await saveChatSessionPreservingMessages(session, session.id === state.selectedSessionId ? state.messages : undefined)
  }
  return {
    ...state,
    sessions: nextSessions,
  }
}