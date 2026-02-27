import { createSession } from '../HandleClick/CreateSession/CreateSession.ts'
import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const handleClickNew = async (state: ChatState): Promise<ChatState> => {
  return createSession(state)
}
