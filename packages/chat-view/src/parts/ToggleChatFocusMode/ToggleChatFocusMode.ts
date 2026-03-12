import type { ChatState } from '../ChatState/ChatState.ts'

export const toggleChatFocusMode = async (state: ChatState): Promise<ChatState> => {
  if (state.viewMode === 'chat-focus') {
    return {
      ...state,
      viewMode: state.lastNormalViewMode,
    }
  }
  if (state.viewMode === 'list' || state.viewMode === 'detail') {
    return {
      ...state,
      lastNormalViewMode: state.viewMode,
      viewMode: 'chat-focus',
    }
  }
  return state
}
