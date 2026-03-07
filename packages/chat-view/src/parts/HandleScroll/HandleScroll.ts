import type { ChatState } from '../ChatState/ChatState.ts'

export const handleChatListScroll = async (state: ChatState, chatListScrollTop: number): Promise<ChatState> => {
  if (state.chatListScrollTop === chatListScrollTop) {
    return state
  }
  return {
    ...state,
    chatListScrollTop,
  }
}

export const handleMessagesScroll = async (state: ChatState, messagesScrollTop: number): Promise<ChatState> => {
  if (state.messagesScrollTop === messagesScrollTop) {
    return state
  }
  return {
    ...state,
    messagesScrollTop,
  }
}
