import type { ChatSession } from '../ViewModel/ViewModel.ts'
import { getChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'

export const loadSelectedSessionMessages = async (sessions: readonly ChatSession[], selectedSessionId: string): Promise<readonly ChatSession[]> => {
  if (!selectedSessionId) {
    return sessions
  }
  const loadedSession = await getChatSession(selectedSessionId)
  if (!loadedSession) {
    return sessions
  }
  let found = false
  const hydratedSessions = sessions.map((session) => {
    if (session.id !== selectedSessionId) {
      return session
    }
    found = true
    return {
      ...session,
      ...loadedSession,
      messages: loadedSession.messages,
    }
  })
  if (found) {
    return hydratedSessions
  }
  return [...sessions, loadedSession]
}
