import type { ChatState } from '../ChatState/ChatState.ts'
import { selectSession } from '../SelectSession/SelectSession.ts'

export const selectListIndex = async (state: ChatState, index: number): Promise<ChatState> => {
  const { sessions } = state
  if (index < 0 || index >= sessions.length) {
    return state
  }
  const session = sessions[index]
  return selectSession(state, session.id)
}
