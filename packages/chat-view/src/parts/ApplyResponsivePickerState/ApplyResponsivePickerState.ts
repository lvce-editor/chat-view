import type { ChatState } from '../ChatState/ChatState.ts'
import {
  AgentModeControl,
  ModelControl,
  ReasoningEffortControl,
  RunModeControl,
  getAvailablePrimaryControls,
} from '../ComposerPrimaryControls/ComposerPrimaryControls.ts'
import { getResponsivePickerState } from '../GetResponsivePickerState/GetResponsivePickerState.ts'

const getControlWidth = (labelWidth: number, selectChevronEnabled: boolean, iconGap: number, iconSize: number): number => {
  return labelWidth + (selectChevronEnabled ? iconGap + iconSize : 0)
}

export const applyResponsivePickerState = (state: ChatState): ChatState => {
  const availablePrimaryControls = getAvailablePrimaryControls(state.reasoningPickerEnabled, state.showRunMode)
  const responsivePickerState = getResponsivePickerState({
    availablePrimaryControls,
    chatSendAreaPaddingLeft: state.chatSendAreaPaddingLeft,
    chatSendAreaPaddingRight: state.chatSendAreaPaddingRight,
    overflowButtonWidth: state.primaryControlsOverflowButtonLabelWidth,
    primaryControlGap: state.primaryControlsGap,
    primaryControlWidths: {
      [AgentModeControl]: getControlWidth(
        state.agentModePickerLabelWidth,
        state.selectChevronEnabled,
        state.primaryControlSelectIconGap,
        state.primaryControlSelectIconSize,
      ),
      [ModelControl]: getControlWidth(
        state.modelPickerLabelWidth,
        state.selectChevronEnabled,
        state.primaryControlSelectIconGap,
        state.primaryControlSelectIconSize,
      ),
      [ReasoningEffortControl]: getControlWidth(
        state.reasoningEffortPickerLabelWidth,
        state.selectChevronEnabled,
        state.primaryControlSelectIconGap,
        state.primaryControlSelectIconSize,
      ),
      [RunModeControl]: getControlWidth(
        state.runModePickerLabelWidth,
        state.selectChevronEnabled,
        state.primaryControlSelectIconGap,
        state.primaryControlSelectIconSize,
      ),
    },
    responsivePickerVisibilityEnabled: state.responsivePickerVisibilityEnabled,
    submitButtonWidth: state.primaryControlsSubmitButtonWidth,
    width: state.width,
  })
  return {
    ...state,
    ...responsivePickerState,
  }
}
