import type { ChatState } from '../ChatState/ChatState.ts'

const minimumProjectSidebarWidth = 180
const minimumChatAreaWidth = 320

export const getProjectSidebarWidth = (state: ChatState, clientX: number): number => {
  const availableWidth = state.width > 0 ? state.width : state.projectSidebarWidth + minimumChatAreaWidth
  const maximumProjectSidebarWidth = Math.max(minimumProjectSidebarWidth, availableWidth - minimumChatAreaWidth)
  const nextWidth = Math.round(clientX - state.x)
  return Math.min(Math.max(nextWidth, minimumProjectSidebarWidth), maximumProjectSidebarWidth)
}

export const resizeProjectSidebar = (state: ChatState, clientX: number): ChatState => {
  const projectSidebarWidth = getProjectSidebarWidth(state, clientX)
  if (projectSidebarWidth === state.projectSidebarWidth) {
    return state
  }
  return {
    ...state,
    projectSidebarWidth,
  }
}
