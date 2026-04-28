import type { ChatState } from '../ChatState/ChatState.ts'
import { applyResponsivePickerState } from '../ApplyResponsivePickerState/ApplyResponsivePickerState.ts'

export const setShowRunMode = (state: ChatState, showRunMode: boolean): ChatState => {
  const nextState = applyResponsivePickerState({
    ...state,
    showRunMode,
  })
  return {
    ...nextState,
    runModePickerOpen: showRunMode && !nextState.hiddenPrimaryControls.includes('run-mode-picker-toggle') ? state.runModePickerOpen : false,
  }
}
