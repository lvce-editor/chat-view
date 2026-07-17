import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { refreshGitBranchPickerVisibility } from '../RefreshGitBranchPickerVisibility/RefreshGitBranchPickerVisibility.ts'

export const toggleChatFocusMode = async (state: ChatState): Promise<ChatState> => {
  const { lastNormalViewMode, viewMode } = state
  if (viewMode === 'chat-focus') {
    await RendererWorker.invoke('Layout.leaveSideBarFocusMode')
    return {
      ...state,
      gitBranchPickerErrorMessage: '',
      gitBranchPickerOpen: false,
      viewMode: lastNormalViewMode,
    }
  }
  if (viewMode === 'list' || viewMode === 'detail') {
    const newState = await refreshGitBranchPickerVisibility({
      ...state,
      lastNormalViewMode: viewMode,
      viewMode: 'chat-focus',
    })
    await RendererWorker.invoke('Layout.enterSideBarFocusMode', 'secondary')
    return newState
  }
  return state
}
