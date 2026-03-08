import type { ChatState } from '../ChatState/ChatState.ts'

export const getListIndex = (state: ChatState, eventX: number, eventY: number): number => {
  const { headerHeight, height, listItemHeight, width, x, y } = state
  const relativeX = eventX - x
  const relativeY = eventY - y - headerHeight
  if (relativeX < 0 || relativeY < 0 || relativeX >= width || relativeY >= height - headerHeight) {
    return -1
  }
  return Math.floor(relativeY / listItemHeight)
}
