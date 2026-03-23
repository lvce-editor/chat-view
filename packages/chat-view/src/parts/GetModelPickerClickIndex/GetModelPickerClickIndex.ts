export const getModelPickerClickIndex = (
  y: number,
  height: number,
  eventY: number,
  modelPickerBottomOffset: number,
  modelPickerItemHeight: number,
  modelPickerHeight: number,
  headerHeight: number,
): number => {
  const modelPickerTop = y + height - modelPickerBottomOffset - modelPickerHeight
  const relativeY = eventY - modelPickerTop - headerHeight
  if (relativeY < 0) {
    return -1
  }
  return Math.floor(relativeY / modelPickerItemHeight)
}
