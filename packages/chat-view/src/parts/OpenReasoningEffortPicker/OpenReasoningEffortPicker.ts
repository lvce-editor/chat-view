import type { ChatState } from '../ChatState/ChatState.ts'

export const openReasoningEffortPicker = (state: ChatState): ChatState => {
  const reasoningEffortPickerOpen = !state.reasoningEffortPickerOpen
  return {
    ...state,
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    reasoningEffortPickerOpen,
    runModePickerOpen: false,
    visibleModels: state.models,
  }
}
