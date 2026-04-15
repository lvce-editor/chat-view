import type { ChatSession } from '../ChatSession/ChatSession.ts'

export const getPinnedSessionsFirst = (sessions: readonly ChatSession[]): readonly ChatSession[] => {
  const pinnedSessions: ChatSession[] = []
  const unpinnedSessions: ChatSession[] = []
  for (const session of sessions) {
    if (session.pinned) {
      pinnedSessions.push(session)
    } else {
      unpinnedSessions.push(session)
    }
  }
  return [...pinnedSessions, ...unpinnedSessions]
}import type { ChatSession } from '../ChatSession/ChatSession.ts'

export const getPinnedSessionsFirst = (sessions: readonly ChatSession[]): readonly ChatSession[] => {
  const pinnedSessions: ChatSession[] = []
  const unpinnedSessions: ChatSession[] = []
  for (const session of sessions) {
    if (session.pinned) {
      pinnedSessions.push(session)
    } else {
      unpinnedSessions.push(session)
    }
  }
  return [...pinnedSessions, ...unpinnedSessions]
}
