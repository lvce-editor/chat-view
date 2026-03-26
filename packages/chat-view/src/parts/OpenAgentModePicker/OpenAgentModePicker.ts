import type { ChatState } from '../ChatState/ChatState.ts'

export const openAgentModePicker = (state: ChatState): ChatState => {
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
