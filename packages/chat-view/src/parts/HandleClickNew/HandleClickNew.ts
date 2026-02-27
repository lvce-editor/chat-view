import type { ChatState } from '../ChatState/ChatState.ts'
import { createSession } from '../CreateSession/CreateSession.ts'

export const handleClickNew = async (state: ChatState): Promise<ChatState> => {
  return createSession(state)
}
