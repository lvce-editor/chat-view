import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { refreshGitBranchPickerVisibility } from '../RefreshGitBranchPickerVisibility/RefreshGitBranchPickerVisibility.ts'

const invokeLayoutCommand = async (method: string, ...params: readonly unknown[]): Promise<void> => {
  try {
    await RendererWorker.invoke(method, ...params)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message === 'module Layout not found' || message === `Command not found ${method}`) {
      return
    }
    throw error
  }
}

export const toggleChatFocusMode = async (state: ChatState): Promise<ChatState> => {
  const { lastNormalViewMode, viewMode } = state
  if (viewMode === 'chat-focus') {
    await invokeLayoutCommand('Layout.leaveSideBarFocusMode')
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
    await invokeLayoutCommand('Layout.enterSideBarFocusMode', 'secondary')
    return newState
  }
  return state
}
