import type { ChatState } from '../ChatState/ChatState.ts'
import { getClampedChatFocusSidebarWidth } from '../GetClampedChatFocusSidebarWidth/GetClampedChatFocusSidebarWidth.ts'

export const handlePointerUpChatFocusSash = async (state: ChatState, clientX: number): Promise<ChatState> => {
  if (!state.chatFocusSidebarResizeActive) {
    return state
  }
  const deltaX = clientX - state.chatFocusSidebarResizeStartX
  const chatFocusSidebarWidth = getClampedChatFocusSidebarWidth(state.chatFocusSidebarResizeStartWidth + deltaX, state.width)
  return {
    ...state,
    chatFocusSidebarResizeActive: false,
    chatFocusSidebarResizeStartWidth: chatFocusSidebarWidth,
    chatFocusSidebarWidth,
  }
}
