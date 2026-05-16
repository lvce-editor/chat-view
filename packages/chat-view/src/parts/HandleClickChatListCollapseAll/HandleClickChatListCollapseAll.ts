import type { ChatState } from '../ChatState/ChatState.ts'

export const handleClickChatListCollapseAll = async (state: ChatState): Promise<ChatState> => {
  return {
    ...state,
    chatListExpanded: false,
    listFocusedIndex: Math.min(state.listFocusedIndex, 2),
  }
}