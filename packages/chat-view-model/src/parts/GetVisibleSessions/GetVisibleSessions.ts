import type { ChatSession } from '../ViewModel/ViewModel.ts'

export const getVisibleSessions = (sessions: readonly ChatSession[], selectedProjectId: string): readonly ChatSession[] => {
  if (!selectedProjectId) {
    return sessions
  }
  const hasAssignedProjects = sessions.some((session) => !!session.projectId)
  if (!hasAssignedProjects) {
    return sessions
  }
  return sessions.filter((session) => session.projectId === selectedProjectId)
}