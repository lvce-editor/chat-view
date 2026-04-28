import type { ChatState } from '../ChatState/ChatState.ts'
import { applyResponsivePickerState } from '../ApplyResponsivePickerState/ApplyResponsivePickerState.ts'

export const setResponsivePickerVisibilityEnabled = (state: ChatState, responsivePickerVisibilityEnabled: boolean): ChatState => {
  const nextState = applyResponsivePickerState({
    ...state,
    responsivePickerVisibilityEnabled,
  })
  return {
    ...nextState,
    agentModePickerOpen: nextState.hiddenPrimaryControls.includes('agent-mode-picker-toggle') ? false : state.agentModePickerOpen,
    modelPickerOpen: nextState.hiddenPrimaryControls.includes('model-picker-toggle') ? false : state.modelPickerOpen,
    reasoningEffortPickerOpen: nextState.hiddenPrimaryControls.includes('reasoning-effort-picker-toggle') ? false : state.reasoningEffortPickerOpen,
    runModePickerOpen: nextState.hiddenPrimaryControls.includes('run-mode-picker-toggle') ? false : state.runModePickerOpen,
  }
}
