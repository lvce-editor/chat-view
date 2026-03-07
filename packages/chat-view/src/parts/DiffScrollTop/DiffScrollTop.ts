import type { ChatState } from '../ChatState/ChatState.ts'

export const diffScrollTop = (oldState: ChatState, newState: ChatState): boolean => {
  return oldState.chatListScrollTop === newState.chatListScrollTop && oldState.messagesScrollTop === newState.messagesScrollTop
}
