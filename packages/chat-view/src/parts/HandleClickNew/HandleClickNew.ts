import type { ChatState } from '../StatusBarState/StatusBarState.ts'
import { createSession } from '../HandleClick/CreateSession/CreateSession.ts'

export const handleClickNew = async (state: ChatState): Promise<ChatState> => {
  return createSession(state)
}
