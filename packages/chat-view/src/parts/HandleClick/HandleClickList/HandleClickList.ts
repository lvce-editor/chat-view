import type { ChatState } from '../../ChatState/ChatState.ts'
import { selectSession } from '../SelectSession/SelectSession.ts'

const HEADER_HEIGHT = 40

export const handleClickList = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  if (eventX < state.x || eventY < state.y) {
    return state
  }
  if (eventX >= state.x + state.width || eventY >= state.y + state.height) {
    return state
  }
  const listY = eventY - state.y - HEADER_HEIGHT
  if (listY < 0) {
    return state
  }
  const itemHeight = state.listItemHeight > 0 ? state.listItemHeight : 40
  const index = Math.floor(listY / itemHeight)
  const session = state.sessions[index]
  if (!session) {
    return state
  }
  return selectSession(state, session.id)
}
