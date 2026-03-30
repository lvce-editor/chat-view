import type { ChatState } from '../ChatState/ChatState.ts'
import { closeGitBranchPicker } from '../CloseGitBranchPicker/CloseGitBranchPicker.ts'

export const handleClickCustomSelectOverlay = async (state: ChatState, defaultPrevented: boolean): Promise<ChatState> => {
  if (defaultPrevented) {
    return state
  }
  return closeGitBranchPicker({
    ...state,
    agentModePickerOpen: false,
    reasoningEffortPickerOpen: false,
    runModePickerOpen: false,
  })
}
