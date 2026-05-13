import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import { getAgentModeLabel } from '../AgentMode/AgentMode.ts'
import * as InputName from '../InputName/InputName.ts'
import { getReasoningEffortLabel } from '../ReasoningEffort/ReasoningEffort.ts'

export const AgentModeControl = InputName.AgentModePickerToggle
export const ModelControl = InputName.ModelPickerToggle
export const ReasoningEffortControl = InputName.ReasoningEffortPickerToggle
export const RunModeControl = InputName.RunModePickerToggle

export const primaryControlsOverflowLabel = '...'
export const primaryControlsGap = 8
export const primaryControlsSubmitButtonWidth = 22
export const primaryControlSelectIconGap = 4
export const primaryControlSelectIconSize = 10
export const primaryControlFontSize = 11

export type ComposerPrimaryControl = typeof AgentModeControl | typeof ModelControl | typeof ReasoningEffortControl | typeof RunModeControl

export const getAvailablePrimaryControls = (reasoningPickerEnabled: boolean, showRunMode: boolean): readonly ComposerPrimaryControl[] => {
  return [
    AgentModeControl,
    ModelControl,
    ...(reasoningPickerEnabled ? ([ReasoningEffortControl] as const) : []),
    ...(showRunMode ? ([RunModeControl] as const) : []),
  ]
}

export const getPrimaryControlLabel = (
  control: ComposerPrimaryControl,
  agentMode: AgentMode,
  models: readonly ChatModel[],
  selectedModelId: string,
  reasoningEffort: ReasoningEffort,
  runMode: RunMode,
): string => {
  switch (control) {
    case AgentModeControl:
      return getAgentModeLabel(agentMode)
    case ModelControl: {
      const selectedModel = models.find((model) => model.id === selectedModelId)
      return selectedModel ? selectedModel.name : selectedModelId
    }
    case ReasoningEffortControl:
      return getReasoningEffortLabel(reasoningEffort)
    case RunModeControl:
      return runMode
    default:
      return ''
  }
}

export const getPrimaryControlCommand = (control: ComposerPrimaryControl): string => {
  switch (control) {
    case AgentModeControl:
      return 'Chat.openAgentModePicker'
    case ModelControl:
      return 'Chat.openModelPicker'
    case ReasoningEffortControl:
      return 'Chat.openReasoningEffortPicker'
    case RunModeControl:
      return 'Chat.openRunModePicker'
    default:
      return ''
  }
}
