import type { ChatState } from '../ChatState/ChatState.ts'

export const toggleChatListExpanded = async (state: ChatState): Promise<ChatState> => {
  const nextExpanded = !state.chatListExpanded
  return {
    ...state,
    chatListExpanded: nextExpanded,
    listFocusedIndex: nextExpanded ? state.listFocusedIndex : Math.min(state.listFocusedIndex, 2),
  }
}
