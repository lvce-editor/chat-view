import type { ChatState } from '../ChatState/ChatState.ts'

export const openRunModePicker = (state: ChatState): ChatState => {
  if (!state.hasSpaceForRunModePicker) {
    return {
      ...state,
      runModePickerOpen: false,
    }
  }
  const runModePickerOpen = !state.runModePickerOpen
  return {
    ...state,
    agentModePickerOpen: false,
    focus: runModePickerOpen ? 'picker-list' : state.focus,
    focused: runModePickerOpen ? true : state.focused,
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    reasoningEffortPickerOpen: false,
    runModePickerOpen,
    visibleModels: state.models,
  }
}
