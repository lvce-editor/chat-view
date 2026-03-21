import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { MenuChatProjectList } from '../GetMenuEntryIds/GetMenuEntryIds.ts'

const getProjectRowIds = (
  projects: ChatState['projects'],
  sessions: readonly ChatSession[],
  projectExpandedIds: readonly string[],
): readonly string[] => {
  const blankProjectId = projects.find((project) => project.name === '_blank')?.id || projects[0]?.id || ''
  const projectRowIds: string[] = []
  for (const project of projects) {
    projectRowIds.push(project.id)
    if (!projectExpandedIds.includes(project.id)) {
      continue
    }
    for (const session of sessions) {
      const sessionProjectId = session.projectId || blankProjectId
      if (sessionProjectId === project.id) {
        projectRowIds.push(project.id)
      }
    }
  }
  return projectRowIds
}

const getProjectIdAtPosition = (state: ChatState, eventY: number): string => {
  const { headerHeight, listItemHeight, projectExpandedIds, projectListScrollTop, projects, sessions, y } = state
  const relativeY = eventY - y - headerHeight + projectListScrollTop
  if (relativeY < 0) {
    return ''
  }
  const index = Math.floor(relativeY / listItemHeight)
  const projectRowIds = getProjectRowIds(projects, sessions, projectExpandedIds)
  return projectRowIds[index] || ''
}

export const handleProjectListContextMenu = async (state: ChatState, button: number, eventX: number, eventY: number): Promise<ChatState> => {
  const { uid } = state
  const projectId = getProjectIdAtPosition(state, eventY)
  await RendererWorker.showContextMenu2(uid, MenuChatProjectList, eventX, eventY, {
    menuId: MenuChatProjectList,
    projectId,
  })
  return state
}
