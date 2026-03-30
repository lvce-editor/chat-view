import type { ChatState } from '../ChatState/ChatState.ts'
import { resizeProjectSidebar } from '../ResizeProjectSidebar/ResizeProjectSidebar.ts'

export const handlePointerUpProjectSidebarSash = async (state: ChatState, clientX: number): Promise<ChatState> => {
  if (!state.projectSidebarResizing) {
    return state
  }
  const nextState = resizeProjectSidebar(state, clientX)
  return {
    ...nextState,
    projectSidebarResizing: false,
  }
}