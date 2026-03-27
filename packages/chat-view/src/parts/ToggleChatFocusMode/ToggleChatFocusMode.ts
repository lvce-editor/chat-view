import type { ChatState } from '../ChatState/ChatState.ts'

export const toggleChatFocusMode = async (state: ChatState): Promise<ChatState> => {
  const { lastNormalViewMode, viewMode } = state
  if (viewMode === 'chat-focus') {
    return {
      ...state,
      viewMode: lastNormalViewMode,
    }
  }
  if (viewMode === 'list' || viewMode === 'detail') {
    return {
      ...state,
      lastNormalViewMode: viewMode,
      viewMode: 'chat-focus',
    }
  }
  return state
}
