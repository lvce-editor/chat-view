import type { ChatState } from '../../ChatState/ChatState.ts'
import { selectSession } from '../SelectSession/SelectSession.ts'

const HEADER_HEIGHT = 40

export const getListIndex = (state: ChatState, eventX: number, eventY: number): number => {
  const { height, listItemHeight, width, x, y } = state
  if (eventX < x || eventY < y) {
    return -1
  }
  if (eventX >= x + width || eventY >= y + height) {
    return -1
  }
  const listY = eventY - y - HEADER_HEIGHT
  if (listY < 0) {
    return -1
  }
  const itemHeight = listItemHeight > 0 ? listItemHeight : 40
  return Math.floor(listY / itemHeight)
}

export const handleClickList = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  const { sessions } = state
  const index = getListIndex(state, eventX, eventY)
  if (index < 0) {
    return state
  }
  const session = sessions[index]
  if (!session) {
    return state
  }
  return selectSession(state, session.id)
}
