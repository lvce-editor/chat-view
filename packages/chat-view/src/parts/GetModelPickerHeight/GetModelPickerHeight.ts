const modelPickerHeaderHeight = 40
const modelPickerItemHeight = 28

export const getModelPickerHeight = (itemCount: number): number => {
  const effectiveItemCount = Math.max(itemCount, 1)
  return modelPickerHeaderHeight + effectiveItemCount * modelPickerItemHeight
}

export const getModelPickerItemHeight = (): number => {
  return modelPickerItemHeight
}
