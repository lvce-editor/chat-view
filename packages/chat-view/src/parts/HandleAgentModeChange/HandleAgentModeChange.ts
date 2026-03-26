import type { ChatState } from '../ChatState/ChatState.ts'
import { isAgentMode } from '../AgentMode/AgentMode.ts'
import { setAgentMode } from '../SetAgentMode/SetAgentMode.ts'

export const handleAgentModeChange = async (state: ChatState, value: string): Promise<ChatState> => {
  if (!isAgentMode(value)) {
    return state
  }
  return setAgentMode(state, value)
}
