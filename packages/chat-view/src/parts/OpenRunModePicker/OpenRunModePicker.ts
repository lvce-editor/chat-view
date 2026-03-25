import type { ChatState } from '../ChatState/ChatState.ts'

export const openRunModePicker = (state: ChatState): ChatState => {
  const runModePickerOpen = !state.runModePickerOpen
  return {
    ...state,
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    reasoningEffortPickerOpen: false,
    runModePickerOpen,
    visibleModels: state.models,
  }
}
