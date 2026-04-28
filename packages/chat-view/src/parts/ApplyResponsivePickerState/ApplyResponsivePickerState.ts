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
  const {
    agentModePickerLabelWidth,
    chatSendAreaPaddingLeft,
    chatSendAreaPaddingRight,
    modelPickerLabelWidth,
    primaryControlSelectIconGap,
    primaryControlSelectIconSize,
    primaryControlsGap,
    primaryControlsOverflowButtonLabelWidth,
    primaryControlsSubmitButtonWidth,
    reasoningEffortPickerLabelWidth,
    reasoningPickerEnabled,
    responsivePickerVisibilityEnabled,
    runModePickerLabelWidth,
    selectChevronEnabled,
    showRunMode,
    width,
  } = state
  const availablePrimaryControls = getAvailablePrimaryControls(reasoningPickerEnabled, showRunMode)
  const responsivePickerState = getResponsivePickerState({
    availablePrimaryControls,
    chatSendAreaPaddingLeft,
    chatSendAreaPaddingRight,
    overflowButtonWidth: primaryControlsOverflowButtonLabelWidth,
    primaryControlGap: primaryControlsGap,
    primaryControlWidths: {
      [AgentModeControl]: getControlWidth(agentModePickerLabelWidth, selectChevronEnabled, primaryControlSelectIconGap, primaryControlSelectIconSize),
      [ModelControl]: getControlWidth(modelPickerLabelWidth, selectChevronEnabled, primaryControlSelectIconGap, primaryControlSelectIconSize),
      [ReasoningEffortControl]: getControlWidth(
        reasoningEffortPickerLabelWidth,
        selectChevronEnabled,
        primaryControlSelectIconGap,
        primaryControlSelectIconSize,
      ),
      [RunModeControl]: getControlWidth(runModePickerLabelWidth, selectChevronEnabled, primaryControlSelectIconGap, primaryControlSelectIconSize),
    },
    responsivePickerVisibilityEnabled,
    submitButtonWidth: primaryControlsSubmitButtonWidth,
    width,
  })
  return {
    ...state,
    ...responsivePickerState,
  }
}
