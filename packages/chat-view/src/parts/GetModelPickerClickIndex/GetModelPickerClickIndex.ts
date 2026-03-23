const modelPickerBottomOffset = 90
const modelPickerItemHeight = 28

export const getModelPickerClickIndex = (y: number, height: number, eventY: number): number => {
  const modelPickerTop = y + height - modelPickerBottomOffset
  const relativeY = eventY - modelPickerTop
  if (relativeY < 0) {
    return -1
  }
  return Math.floor(relativeY / modelPickerItemHeight)
}
