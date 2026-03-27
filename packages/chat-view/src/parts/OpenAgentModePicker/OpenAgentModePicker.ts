import type { ChatState } from '../ChatState/ChatState.ts'

export const openAgentModePicker = (state: ChatState): ChatState => {
  if (!state.hasSpaceForAgentModePicker) {
    return {
      ...state,
      agentModePickerOpen: false,
    }
  }
  const agentModePickerOpen = !state.agentModePickerOpen
  return {
    ...state,
    agentModePickerOpen,
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    reasoningEffortPickerOpen: false,
    runModePickerOpen: false,
    visibleModels: state.models,
  }
}
