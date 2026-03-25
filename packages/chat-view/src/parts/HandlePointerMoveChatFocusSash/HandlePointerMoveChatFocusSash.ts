import type { ChatState } from '../ChatState/ChatState.ts'
import { getClampedChatFocusSidebarWidth } from '../GetClampedChatFocusSidebarWidth/GetClampedChatFocusSidebarWidth.ts'

export const handlePointerMoveChatFocusSash = async (state: ChatState, clientX: number): Promise<ChatState> => {
  if (!state.chatFocusSidebarResizeActive) {
    return state
  }
  const deltaX = clientX - state.chatFocusSidebarResizeStartX
  return {
    ...state,
    chatFocusSidebarWidth: getClampedChatFocusSidebarWidth(state.chatFocusSidebarResizeStartWidth + deltaX, state.width),
  }
}
