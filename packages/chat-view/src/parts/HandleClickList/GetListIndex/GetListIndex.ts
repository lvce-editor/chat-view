import type { ChatState } from '../../../ChatState/ChatState.ts'

export const getListIndex = (state: ChatState, eventX: number, eventY: number): number => {
  const { headerHeight, height, listItemHeight, width, x, y } = state
  if (eventX < x || eventY < y) {
    return -1
  }
  if (eventX >= x + width || eventY >= y + height) {
    return -1
  }
  const listY = eventY - y - headerHeight
  if (listY < 0) {
    return -1
  }
  const itemHeight = listItemHeight > 0 ? listItemHeight : 40
  return Math.floor(listY / itemHeight)
}
