import type { ChatState } from '../ChatState/ChatState.ts'
import { toggleSessionPinned } from '../ToggleSessionPinned/ToggleSessionPinned.ts'

export const handleClickPin = async (state: ChatState, sessionId = ''): Promise<ChatState> => {
  return toggleSessionPinned(state, sessionId)
}
