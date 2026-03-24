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

export const handleMessagesScroll = async (
  state: ChatState,
  messagesScrollTop: number,
  scrollHeight: number,
  clientHeight: number,
): Promise<ChatState> => {
  const messagesAutoScrollEnabled = messagesScrollTop + clientHeight >= scrollHeight - 8
  if (state.messagesScrollTop === messagesScrollTop && state.messagesAutoScrollEnabled === messagesAutoScrollEnabled) {
    return state
  }
  return {
    ...state,
    messagesAutoScrollEnabled,
    messagesScrollTop,
  }
}

export const handleProjectListScroll = async (state: ChatState, projectListScrollTop: number): Promise<ChatState> => {
  if (state.projectListScrollTop === projectListScrollTop) {
    return state
  }
  return {
    ...state,
    projectListScrollTop,
  }
}

export const handleModelPickerListScroll = async (state: ChatState, modelPickerListScrollTop: number): Promise<ChatState> => {
  if (state.modelPickerListScrollTop === modelPickerListScrollTop) {
    return state
  }
  return {
    ...state,
    modelPickerListScrollTop,
  }
}
