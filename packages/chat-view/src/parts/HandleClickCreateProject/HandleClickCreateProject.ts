import type { ChatState } from '../ChatState/ChatState.ts'
import type { Project } from '../Project/Project.ts'
import { openFolder } from '../OpenFolder/OpenFolder.ts'
import { selectProject } from '../SelectProject/SelectProject.ts'

const fileSchemeRegex = /^file:\/\//
const trailingSlashesRegex = /\/+$/

const getProjectName = (uri: string, fallbackIndex: number): string => {
  if (!uri) {
    return `Project ${fallbackIndex}`
  }
  const withoutScheme = uri.replace(fileSchemeRegex, '')
  const normalized = withoutScheme.replace(trailingSlashesRegex, '')
  const lastSegment = normalized.split('/').pop()
  if (!lastSegment) {
    return `Project ${fallbackIndex}`
  }
  return decodeURIComponent(lastSegment)
}

const getNextProjectId = (projects: readonly Project[]): string => {
  return `project-${projects.length + 1}`
}

export const handleClickCreateProject = async (state: ChatState): Promise<ChatState> => {
  const uri = await openFolder()
  if (!uri) {
    return state
  }
  const existingProject = state.projects.find((project) => project.uri === uri)
  if (existingProject) {
    return selectProject(state, existingProject.id)
  }
  const id = getNextProjectId(state.projects)
  const project: Project = {
    id,
    name: getProjectName(uri, state.projects.length + 1),
    uri,
  }
  return {
    ...state,
    composerAttachments: [],
    composerAttachmentsHeight: 0,
    projects: [...state.projects, project],
    selectedProjectId: project.id,
    selectedSessionId: '',
    viewMode: 'list',
  }
}
