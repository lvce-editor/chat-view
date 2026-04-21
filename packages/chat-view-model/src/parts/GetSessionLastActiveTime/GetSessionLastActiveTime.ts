import type { ChatSession } from '../ChatSession/ChatSession.ts'

export const getSessionLastActiveTime = (session: ChatSession): string | undefined => {
  if (session.lastActiveTime) {
    return session.lastActiveTime
  }
  return session.messages.at(-1)?.time
}
