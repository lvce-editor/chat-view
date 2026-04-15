import type { ChatSession } from '../ChatSession/ChatSession.ts'
import { getPinnedSessionsFirst } from '../GetPinnedSessionsFirst/GetPinnedSessionsFirst.ts'

export const getVisibleSessions = (
  sessions: readonly ChatSession[],
  selectedProjectId: string,
  sessionPinningEnabled = true,
): readonly ChatSession[] => {
  if (!selectedProjectId) {
    return sessionPinningEnabled ? getPinnedSessionsFirst(sessions) : sessions
  }
  const hasAssignedProjects = sessions.some((session) => !!session.projectId)
  if (!hasAssignedProjects) {
    return sessionPinningEnabled ? getPinnedSessionsFirst(sessions) : sessions
  }
  const filteredSessions = sessions.filter((session) => session.projectId === selectedProjectId)
  return sessionPinningEnabled ? getPinnedSessionsFirst(filteredSessions) : filteredSessions
}
