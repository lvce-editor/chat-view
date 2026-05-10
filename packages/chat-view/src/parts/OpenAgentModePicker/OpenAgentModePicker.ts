import { ChatState } from '../ChatState/ChatState.ts'

export const openAgentModePicker = (state: ChatState): ChatState => {
  const { agentModePickerOpen, focus, focused, models } = state
  const newAgentModePickerOpen = !agentModePickerOpen
  return {
    ...state,
    agentModePickerOpen: newAgentModePickerOpen,
    focus: newAgentModePickerOpen ? 'picker-list' : focus,
    focused: newAgentModePickerOpen ? true : focused,
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    reasoningEffortPickerOpen: false,
    runModePickerOpen: false,
    visibleModels: models,
  }
}
