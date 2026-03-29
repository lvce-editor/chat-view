import type { ChatState } from '../ChatState/ChatState.ts'
import { refreshGitBranchPickerVisibility } from '../RefreshGitBranchPickerVisibility/RefreshGitBranchPickerVisibility.ts'

export const toggleChatFocusMode = async (state: ChatState): Promise<ChatState> => {
  const { lastNormalViewMode, viewMode } = state
  if (viewMode === 'chat-focus') {
    return {
      ...state,
      gitBranchPickerErrorMessage: '',
      gitBranchPickerOpen: false,
      viewMode: lastNormalViewMode,
    }
  }
  if (viewMode === 'list' || viewMode === 'detail') {
    return refreshGitBranchPickerVisibility({
      ...state,
      lastNormalViewMode: viewMode,
      viewMode: 'chat-focus',
    })
  }
  return state
}
