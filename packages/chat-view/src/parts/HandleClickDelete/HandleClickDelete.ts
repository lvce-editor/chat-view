import type { ChatState } from '../StatusBarState/StatusBarState.ts'
import { deleteSession } from '../HandleClick/DeleteSession/DeleteSession.ts'

export const handleClickDelete = async (state: ChatState, sessionId = ''): Promise<ChatState> => {
  return deleteSession(state, sessionId)
}
