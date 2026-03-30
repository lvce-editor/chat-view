import type { ChatState } from '../ChatState/ChatState.ts'
import { resizeProjectSidebar } from '../ResizeProjectSidebar/ResizeProjectSidebar.ts'

export const handlePointerMoveProjectSidebarSash = async (state: ChatState, clientX: number): Promise<ChatState> => {
  if (!state.projectSidebarResizing) {
    return state
  }
  return resizeProjectSidebar(state, clientX)
}