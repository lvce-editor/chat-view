import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import type { Project } from '../Project/Project.ts'
import { MenuChatProjectList } from '../GetMenuEntryIds/GetMenuEntryIds.ts'

const getProjectAtIndex = (state: ChatState, index: number): Project | undefined => {
  const { projectExpandedIds, projects, sessions } = state
  const blankProjectId = projects.find((project) => project.name === '_blank')?.id || projects[0]?.id || ''
  let currentIndex = 0
  for (const project of projects) {
    if (currentIndex === index) {
      return project
    }
    currentIndex++
    if (projectExpandedIds.includes(project.id)) {
      for (const session of sessions) {
        const sessionProjectId = session.projectId || blankProjectId
        if (sessionProjectId !== project.id) {
          continue
        }
        if (currentIndex === index) {
          return project
        }
        currentIndex++
      }
    }
  }
  return undefined
}

const getProjectListIndex = (state: ChatState, y: number): number => {
  return Math.floor((y - state.headerHeight + state.projectListScrollTop) / state.listItemHeight)
}

export const handleProjectListContextMenu = async (state: ChatState, button: number, x: number, y: number): Promise<ChatState> => {
  const { uid } = state
  const index = getProjectListIndex(state, y)
  if (index < 0) {
    return state
  }
  const project = getProjectAtIndex(state, index)
  if (!project) {
    return state
  }
  await RendererWorker.showContextMenu2(uid, MenuChatProjectList, x, y, {
    canRemoveProject: project.name !== '_blank',
    menuId: MenuChatProjectList,
    projectId: project.id,
  })
  return state
}
