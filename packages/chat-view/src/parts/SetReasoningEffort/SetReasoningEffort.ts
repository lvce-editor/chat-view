import type { ChatState } from '../ChatState/ChatState.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'

export const setReasoningEffort = (state: ChatState, reasoningEffort: ReasoningEffort): ChatState => {
  return {
    ...state,
    agentModePickerOpen: false,
    reasoningEffort,
    reasoningEffortPickerOpen: false,
  }
}
