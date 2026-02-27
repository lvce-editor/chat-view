import type { ChatState } from '../../StatusBarState/StatusBarState.ts'
import { selectSession } from '../SelectSession/SelectSession.ts'

export const handleClickList = async (state: ChatState, x: number, y: number): Promise<ChatState> => {
  if (x < 0 || y < 0) {
    return state
  }
  const itemHeight = state.listItemHeight > 0 ? state.listItemHeight : 40
  const index = Math.floor(y / itemHeight)
  const session = state.sessions[index]
  if (!session) {
    return state
  }
  return selectSession(state, session.id)
}
