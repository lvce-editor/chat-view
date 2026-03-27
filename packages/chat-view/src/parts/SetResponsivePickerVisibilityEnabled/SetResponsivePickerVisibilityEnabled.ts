import type { ChatState } from '../ChatState/ChatState.ts'
import { getResponsivePickerState } from '../GetResponsivePickerState/GetResponsivePickerState.ts'

export const setResponsivePickerVisibilityEnabled = (state: ChatState, responsivePickerVisibilityEnabled: boolean): ChatState => {
  const responsivePickerState = getResponsivePickerState(state.width, responsivePickerVisibilityEnabled)
  return {
    ...state,
    ...responsivePickerState,
    agentModePickerOpen: responsivePickerState.hasSpaceForAgentModePicker ? state.agentModePickerOpen : false,
    responsivePickerVisibilityEnabled,
    runModePickerOpen: responsivePickerState.hasSpaceForRunModePicker ? state.runModePickerOpen : false,
  }
}
