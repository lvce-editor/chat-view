import type { ChatState } from '../ChatState/ChatState.ts'
import { startRename } from '../StartRename/StartRename.ts'

export const handleClickRename = (state: ChatState, sessionId = ''): Promise<ChatState> => {
  return startRename(state, sessionId)
}