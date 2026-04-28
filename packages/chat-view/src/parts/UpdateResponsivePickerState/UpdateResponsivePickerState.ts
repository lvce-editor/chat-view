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
  const { agentMode, composerFontFamily, models, reasoningEffort, runMode, selectedModelId } = state
  const agentModeLabel = getPrimaryControlLabel(AgentModeControl, agentMode, models, selectedModelId, reasoningEffort, runMode)
  const modelLabel = getPrimaryControlLabel(ModelControl, agentMode, models, selectedModelId, reasoningEffort, runMode)
  const reasoningEffortLabel = getPrimaryControlLabel(ReasoningEffortControl, agentMode, models, selectedModelId, reasoningEffort, runMode)
  const runModeLabel = getPrimaryControlLabel(RunModeControl, agentMode, models, selectedModelId, reasoningEffort, runMode)
  const [
    agentModePickerLabelWidth,
    modelPickerLabelWidth,
    reasoningEffortPickerLabelWidth,
    runModePickerLabelWidth,
    primaryControlsOverflowButtonLabelWidth,
  ] = await Promise.all([
    getMeasuredTextWidth(agentModeLabel, composerFontFamily),
    getMeasuredTextWidth(modelLabel, composerFontFamily),
    getMeasuredTextWidth(reasoningEffortLabel, composerFontFamily),
    getMeasuredTextWidth(runModeLabel, composerFontFamily),
    getMeasuredTextWidth(primaryControlsOverflowLabel, composerFontFamily),
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
