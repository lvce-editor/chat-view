import type { ChatState } from '../ChatState/ChatState.ts'

export const handlePointerDownProjectSidebarSash = async (state: ChatState): Promise<ChatState> => {
  if (state.projectSidebarResizing) {
    return state
  }
  return {
    ...state,
    projectSidebarResizing: true,
  }
}