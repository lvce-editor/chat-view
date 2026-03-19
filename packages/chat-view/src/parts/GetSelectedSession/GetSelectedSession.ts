import type { ChatSession } from '../ChatState/ChatState.ts'

export const getSelectedSession = (sessions: readonly ChatSession[], selectedSessionId: string): ChatSession | undefined => {
  return sessions.find((session) => session.id === selectedSessionId)
}
