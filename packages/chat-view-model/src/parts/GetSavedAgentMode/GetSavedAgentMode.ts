import { isAgentMode, type AgentMode } from '../AgentMode/AgentMode.ts'
import { isObject } from '../IsObject/IsObject.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const getSavedAgentMode = (savedState: unknown): AgentMode | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { agentMode } = savedState as Partial<SavedState>
  if (typeof agentMode !== 'string') {
    return undefined
  }
  if (!isAgentMode(agentMode)) {
    return undefined
  }
  return agentMode
}
