import type { ChatState } from '../ChatState/ChatState.ts'

export const openModelPicker = (state: ChatState): ChatState => {
  return {
    ...state,
    modelPickerOpen: !state.modelPickerOpen,
    modelPickerSearchValue: state.modelPickerOpen ? '' : state.modelPickerSearchValue,
  }
}
