import type { ChatSession } from '../ChatSession/ChatSession.ts'

export const getVisibleSessions = (sessions: readonly ChatSession[], selectedProjectId: string, searchValue = ''): readonly ChatSession[] => {
  let filtered = sessions
  if (selectedProjectId) {
    const hasAssignedProjects = sessions.some((session) => !!session.projectId)
    if (hasAssignedProjects) {
      filtered = sessions.filter((session) => session.projectId === selectedProjectId)
    }
  }
  const searchValueTrimmed = searchValue.trim().toLowerCase()
  if (!searchValueTrimmed) {
    return filtered
  }
  return filtered.filter((session) => session.title.toLowerCase().includes(searchValueTrimmed))
}
