import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState, Project } from '../ChatState/ChatState.ts'
import { selectProject } from '../SelectProject/SelectProject.ts'

const getProjectName = (uri: string, fallbackIndex: number): string => {
  if (!uri) {
    return `Project ${fallbackIndex}`
  }
  const withoutScheme = uri.replace(/^file:\/\//, '')
  const normalized = withoutScheme.replace(/\/+$/, '')
  const lastSegment = normalized.split('/').pop()
  if (!lastSegment) {
    return `Project ${fallbackIndex}`
  }
  return decodeURIComponent(lastSegment)
}

const getNextProjectId = (projects: readonly Project[]): string => {
  return `project-${projects.length + 1}`
}

const pickProjectUri = async (): Promise<string> => {
  try {
    const workspaceUri = await RendererWorker.getWorkspacePath()
    return workspaceUri
  } catch {
    return ''
  }
}

export const handleClickCreateProject = async (state: ChatState): Promise<ChatState> => {
  await RendererWorker.confirm('project added')
  const uri = await pickProjectUri()
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
    projects: [...state.projects, project],
    selectedProjectId: project.id,
    selectedSessionId: '',
    viewMode: 'list',
  }
}
