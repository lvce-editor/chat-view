import type { ChatState } from '../ChatState/ChatState.ts'
import { applyResponsivePickerState } from '../ApplyResponsivePickerState/ApplyResponsivePickerState.ts'
import {
  AgentModeControl,
  ModelControl,
  ReasoningEffortControl,
  RunModeControl,
  getPrimaryControlLabel,
  primaryControlFontSize,
  primaryControlsOverflowLabel,
} from '../ComposerPrimaryControls/ComposerPrimaryControls.ts'
import { estimateTextWidth, measureTextWidth } from '../MeasureTextWidth/MeasureTextWidth.ts'

const getMeasuredTextWidth = async (text: string, fontFamily: string): Promise<number> => {
  try {
    return await measureTextWidth(text, fontFamily, primaryControlFontSize)
  } catch {
    return estimateTextWidth(text, primaryControlFontSize)
  }
}

export const updateResponsivePickerState = async (state: ChatState): Promise<ChatState> => {
  const agentModeLabel = getPrimaryControlLabel(
    AgentModeControl,
    state.agentMode,
    state.models,
    state.selectedModelId,
    state.reasoningEffort,
    state.runMode,
  )
  const modelLabel = getPrimaryControlLabel(ModelControl, state.agentMode, state.models, state.selectedModelId, state.reasoningEffort, state.runMode)
  const reasoningEffortLabel = getPrimaryControlLabel(
    ReasoningEffortControl,
    state.agentMode,
    state.models,
    state.selectedModelId,
    state.reasoningEffort,
    state.runMode,
  )
  const runModeLabel = getPrimaryControlLabel(
    RunModeControl,
    state.agentMode,
    state.models,
    state.selectedModelId,
    state.reasoningEffort,
    state.runMode,
  )
  const [
    agentModePickerLabelWidth,
    modelPickerLabelWidth,
    reasoningEffortPickerLabelWidth,
    runModePickerLabelWidth,
    primaryControlsOverflowButtonLabelWidth,
  ] = await Promise.all([
    getMeasuredTextWidth(agentModeLabel, state.composerFontFamily),
    getMeasuredTextWidth(modelLabel, state.composerFontFamily),
    getMeasuredTextWidth(reasoningEffortLabel, state.composerFontFamily),
    getMeasuredTextWidth(runModeLabel, state.composerFontFamily),
    getMeasuredTextWidth(primaryControlsOverflowLabel, state.composerFontFamily),
  ])
  return applyResponsivePickerState({
    ...state,
    agentModePickerLabelWidth,
    modelPickerLabelWidth,
    primaryControlsOverflowButtonLabelWidth,
    reasoningEffortPickerLabelWidth,
    runModePickerLabelWidth,
  })
}
