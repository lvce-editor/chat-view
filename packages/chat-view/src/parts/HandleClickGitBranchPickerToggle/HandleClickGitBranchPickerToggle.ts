import type { ChatState } from '../ChatState/ChatState.ts'
import { closeGitBranchPicker } from '../CloseGitBranchPicker/CloseGitBranchPicker.ts'
import { openGitBranchPicker } from '../OpenGitBranchPicker/OpenGitBranchPicker.ts'

export const handleClickGitBranchPickerToggle = async (state: ChatState): Promise<ChatState> => {
  if (state.gitBranchPickerOpen) {
    return closeGitBranchPicker(state)
  }
  return openGitBranchPicker(state)
}
