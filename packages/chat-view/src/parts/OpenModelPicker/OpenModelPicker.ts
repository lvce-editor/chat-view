import type { ChatState } from '../ChatState/ChatState.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'

export const openModelPicker = (state: ChatState): ChatState => {
  const modelPickerOpen = !state.modelPickerOpen
  const visibleModels = state.modelPickerOpen ? state.models : state.visibleModels
  return {
    ...state,
    modelPickerHeight: getModelPickerHeight(visibleModels.length),
    modelPickerOpen,
    modelPickerSearchValue: state.modelPickerOpen ? '' : state.modelPickerSearchValue,
    visibleModels,
  }
}
