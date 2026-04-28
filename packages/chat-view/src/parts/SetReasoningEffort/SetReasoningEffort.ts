import type { ChatState } from '../ChatState/ChatState.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import { applyResponsivePickerState } from '../ApplyResponsivePickerState/ApplyResponsivePickerState.ts'

export const setReasoningEffort = (state: ChatState, reasoningEffort: ReasoningEffort): ChatState => {
  return applyResponsivePickerState({
    ...state,
    agentModePickerOpen: false,
    reasoningEffort,
    reasoningEffortPickerOpen: false,
  })
}
