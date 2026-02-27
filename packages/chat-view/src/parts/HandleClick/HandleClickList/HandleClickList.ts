import type { ChatState } from '../../StatusBarState/StatusBarState.ts'
import { selectSession } from '../SelectSession/SelectSession.ts'

export const handleClickList = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  if (eventX < 0 || eventY < 0) {
    return state
  }
  const itemHeight = state.listItemHeight > 0 ? state.listItemHeight : 40
  const index = Math.floor(eventY / itemHeight)
  const session = state.sessions[index]
  if (!session) {
    return state
  }
  return selectSession(state, session.id)
}
