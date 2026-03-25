import type { ChatState } from '../ChatState/ChatState.ts'
import * as HandleSubmit from '../HandleSubmit/HandleSubmit.ts'
import * as SubmitRename from '../SubmitRename/SubmitRename.ts'

export const handleKeyDown = async (state: ChatState, key: string, shiftKey: boolean): Promise<ChatState> => {
  const { renamingSessionId } = state
  if (key !== 'Enter' || shiftKey) {
    return state
  }
  if (renamingSessionId) {
    return SubmitRename.submitRename(state)
  }
  return HandleSubmit.handleSubmit(state)
}
