import type { ChatState } from '../ChatState/ChatState.ts'

export const closeGitBranchPicker = (state: ChatState): ChatState => {
  if (!state.gitBranchPickerOpen && !state.gitBranchPickerErrorMessage) {
    return state
  }
  return {
    ...state,
    gitBranchPickerErrorMessage: '',
    gitBranchPickerOpen: false,
  }
}
