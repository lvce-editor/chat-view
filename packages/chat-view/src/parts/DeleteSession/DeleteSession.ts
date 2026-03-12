import type { ChatState } from '../ChatState/ChatState.ts'
import { deleteChatSession, getChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getNextSelectedSessionId } from '../GetNextSelectedSessionId/GetNextSelectedSessionId.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const deleteSession = async (state: ChatState, id: string): Promise<ChatState> => {
  const { renamingSessionId, sessions } = state
  const filtered = sessions.filter((session) => session.id !== id)
  if (filtered.length === sessions.length) {
    return state
  }
  await deleteChatSession(id)
  if (filtered.length === 0) {
    return {
      ...state,
      renamingSessionId: '',
      selectedSessionId: '',
      sessions: [],
      viewMode: 'list',
    }
  }
  const nextSelectedSessionId = getNextSelectedSessionId(filtered, id)
  const loadedSession = await getChatSession(nextSelectedSessionId)
  const hydratedSessions = filtered.map((session) => {
    if (session.id !== nextSelectedSessionId) {
      return session
    }
    if (!loadedSession) {
      return session
    }
    return loadedSession
  })
  return {
    ...state,
    renamingSessionId: renamingSessionId === id ? '' : renamingSessionId,
    selectedSessionId: nextSelectedSessionId,
    sessions: hydratedSessions,
  }
}

export const deleteSessionAtIndex = async (state: ChatState, index: number): Promise<ChatState> => {
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId)
  const session = visibleSessions[index]
  if (!session) {
    return state
  }
  return deleteSession(state, session.id)
}
