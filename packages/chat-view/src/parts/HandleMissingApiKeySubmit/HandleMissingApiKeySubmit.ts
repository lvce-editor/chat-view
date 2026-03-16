import type { ChatState } from '../ChatState/ChatState.ts'
import { handleClick } from '../HandleClick/HandleClick.ts'

export const handleMissingApiKeySubmit = async (state: ChatState, submitterName = ''): Promise<ChatState> => {
  if (!submitterName) {
    return state
  }
  return handleClick(state, submitterName)
}
