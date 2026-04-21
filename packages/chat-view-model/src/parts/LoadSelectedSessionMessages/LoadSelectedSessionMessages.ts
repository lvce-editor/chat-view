import { getChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import type { ChatSession } from '../ViewModel/ViewModel.ts'

export const loadSelectedSessionMessages = async (sessions: readonly ChatSession[], selectedSessionId: string): Promise<readonly ChatSession[]> => {
  if (!selectedSessionId) {
    return sessions
  }
  const loadedSession = await getChatSession(selectedSessionId)
  if (!loadedSession) {
    return sessions
  }
  return sessions.map((session) => {
    if (session.id !== selectedSessionId) {
      return session
    }
    return loadedSession
  })
}
