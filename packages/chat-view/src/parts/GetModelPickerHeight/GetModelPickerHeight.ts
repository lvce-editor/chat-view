const modelPickerItemHeight = 28

export const getModelPickerHeight = (modelPickerHeaderHeight: number, itemCount: number): number => {
  const effectiveItemCount = Math.max(itemCount, 1)
  return Math.min(240, modelPickerHeaderHeight + effectiveItemCount * modelPickerItemHeight)
}

export const getModelPickerItemHeight = (): number => {
  return modelPickerItemHeight
}
