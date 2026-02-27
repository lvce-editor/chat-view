import type { ChatState } from '../../ChatState/ChatState.ts'
import { selectSession } from '../SelectSession/SelectSession.ts'

const HEADER_HEIGHT = 40

export const handleClickList = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  const { height, listItemHeight, sessions, width, x, y } = state
  if (eventX < x || eventY < y) {
    return state
  }
  if (eventX >= x + width || eventY >= y + height) {
    return state
  }
  const listY = eventY - y - HEADER_HEIGHT
  if (listY < 0) {
    return state
  }
  const itemHeight = listItemHeight > 0 ? listItemHeight : 40
  const index = Math.floor(listY / itemHeight)
  const session = sessions[index]
  if (!session) {
    return state
  }
  return selectSession(state, session.id)
}
