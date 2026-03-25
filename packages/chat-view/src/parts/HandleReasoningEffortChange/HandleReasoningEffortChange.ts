import type { ChatState } from '../ChatState/ChatState.ts'
import { isReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import { setReasoningEffort } from '../SetReasoningEffort/SetReasoningEffort.ts'

export const handleReasoningEffortChange = async (state: ChatState, value: string): Promise<ChatState> => {
  if (!isReasoningEffort(value)) {
    return state
  }
  return setReasoningEffort(state, value)
}
