import type { ChatState } from '../ChatState/ChatState.ts'

export const setReasoningPickerEnabled = (state: ChatState, reasoningPickerEnabled: boolean): ChatState => {
  return {
    ...state,
    reasoningEffortPickerOpen: reasoningPickerEnabled ? state.reasoningEffortPickerOpen : false,
    reasoningPickerEnabled,
  }
}
