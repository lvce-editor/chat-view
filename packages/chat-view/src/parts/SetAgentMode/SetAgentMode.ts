import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ChatState } from '../ChatState/ChatState.ts'

export const setAgentMode = (state: ChatState, agentMode: AgentMode): ChatState => {
  return {
    ...state,
    agentMode,
    agentModePickerOpen: false,
  }
}
