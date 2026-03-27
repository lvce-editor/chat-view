import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'

export const getProjectUri = (state: ChatState, projectId: string): string => {
  return state.projects.find((project) => project.id === projectId)?.uri || ''
}

export const getWorkspaceUri = (state: ChatState, session: ChatSession | undefined): string => {
  if (session?.workspaceUri) {
    return session.workspaceUri
  }
  return getProjectUri(state, session?.projectId || state.selectedProjectId)
}
