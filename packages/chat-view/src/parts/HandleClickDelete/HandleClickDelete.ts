import type { ChatState } from '../ChatState/ChatState.ts'
import { deleteSession } from '../DeleteSession/DeleteSession.ts'

export const handleClickDelete = async (state: ChatState, sessionId = ''): Promise<ChatState> => {
  return deleteSession(state, sessionId)
}
