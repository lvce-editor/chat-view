import type { ChatState } from '../ChatState/ChatState.ts'

export const handlePointerDownChatFocusSash = async (state: ChatState, clientX: number): Promise<ChatState> => {
  return {
    ...state,
    chatFocusSidebarResizeActive: true,
    chatFocusSidebarResizeStartWidth: state.chatFocusSidebarWidth,
    chatFocusSidebarResizeStartX: clientX,
  }
}
