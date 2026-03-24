import type { ChatSession } from '../ChatSession/ChatSession.ts'

export const getNextSelectedSessionId = (sessions: readonly ChatSession[], deletedId: string): string => {
  if (sessions.length === 0) {
    return ''
  }
  const index = sessions.findIndex((session) => session.id === deletedId)
  if (index === -1) {
    return sessions[0].id
  }
  const nextIndex = Math.min(index, sessions.length - 1)
  return sessions[nextIndex].id
}
