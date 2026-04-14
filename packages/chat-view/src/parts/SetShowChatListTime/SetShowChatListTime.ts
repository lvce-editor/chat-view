import type { ChatState } from '../ChatState/ChatState.ts'

export const setShowChatListTime = (state: ChatState, showChatListTime: boolean): ChatState => {
  return {
    ...state,
    showChatListTime,
  }
}
