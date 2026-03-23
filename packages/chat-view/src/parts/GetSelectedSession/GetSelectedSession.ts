import type { ChatSession } from '../ChatSession/ChatSession.ts'
export const getSelectedSession = (sessions: readonly ChatSession[], selectedSessionId: string): ChatSession | undefined => {
  return sessions.find((session) => session.id === selectedSessionId)
}
