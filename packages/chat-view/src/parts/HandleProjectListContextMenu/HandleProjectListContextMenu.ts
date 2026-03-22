import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { MenuChatProjectList } from '../GetMenuEntryIds/GetMenuEntryIds.ts'

const getProjectIdAtIndex = (state: ChatState, index: number): string => {
  const { projectExpandedIds, projects, sessions } = state
  const blankProjectId = projects.find((project) => project.name === '_blank')?.id || projects[0]?.id || ''
  let currentIndex = 0
  for (const project of projects) {
    if (currentIndex === index) {
      return project.id
    }
    currentIndex++
    if (projectExpandedIds.includes(project.id)) {
      for (const session of sessions) {
        const sessionProjectId = session.projectId || blankProjectId
        if (sessionProjectId !== project.id) {
          continue
        }
        if (currentIndex === index) {
          return project.id
        }
        currentIndex++
      }
    }
  }
  return ''
}

export const handleProjectListContextMenu = async (state: ChatState, button: number, x: number, y: number): Promise<ChatState> => {
  const { headerHeight, listItemHeight, projectListScrollTop, uid } = state
  const index = Math.floor((y - headerHeight + projectListScrollTop) / listItemHeight)
  if (index < 0) {
    return state
  }
  const projectId = getProjectIdAtIndex(state, index)
  if (!projectId) {
    return state
  }
  await RendererWorker.showContextMenu2(uid, MenuChatProjectList, x, y, {
    menuId: MenuChatProjectList,
    projectId,
  })
  return state
}
