import type { ChatState } from '../ChatState/ChatState.ts'

export const openModelPicker = (state: ChatState): ChatState => {
  const modelPickerOpen = !state.modelPickerOpen
  return {
    ...state,
    modelPickerOpen,
    modelPickerSearchValue: state.modelPickerOpen ? '' : state.modelPickerSearchValue,
    visibleModels: state.modelPickerOpen ? state.models : state.visibleModels,
  }
}
