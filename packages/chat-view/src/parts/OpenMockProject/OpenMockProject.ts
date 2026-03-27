import type { ChatState } from '../ChatState/ChatState.ts'
import type { Project } from '../Project/Project.ts'

export const openMockProject = async (state: ChatState, projectId: string, projectName: string, projectUri: string): Promise<ChatState> => {
  if (!projectId || !projectName) {
    return state
  }
  const project: Project = {
    id: projectId,
    name: projectName,
    uri: projectUri,
  }
  const projects = state.projects.some((candidate) => candidate.id === projectId)
    ? state.projects.map((candidate) => {
        if (candidate.id !== projectId) {
          return candidate
        }
        return project
      })
    : [...state.projects, project]
  return {
    ...state,
    projectExpandedIds: state.projectExpandedIds.includes(projectId) ? state.projectExpandedIds : [...state.projectExpandedIds, projectId],
    projects,
    selectedProjectId: projectId,
  }
}
