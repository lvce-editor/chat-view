import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { applyResponsivePickerState } from '../ApplyResponsivePickerState/ApplyResponsivePickerState.ts'

export const setAgentMode = (state: ChatState, agentMode: AgentMode): ChatState => {
  return applyResponsivePickerState({
    ...state,
    agentMode,
    agentModePickerOpen: false,
  })
}
