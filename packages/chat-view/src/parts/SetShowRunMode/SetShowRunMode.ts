import type { ChatState } from '../ChatState/ChatState.ts'

export const setShowRunMode = (state: ChatState, showRunMode: boolean): ChatState => {
  return {
    ...state,
    runModePickerOpen: showRunMode ? state.runModePickerOpen : false,
    showRunMode,
  }
}
