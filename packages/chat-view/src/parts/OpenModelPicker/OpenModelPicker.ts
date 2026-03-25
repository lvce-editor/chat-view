import type { ChatState } from '../ChatState/ChatState.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'

export const FocusModelPickerInput = 912444

export const openModelPicker = (state: ChatState): ChatState => {
  const { modelPickerOpen: currentModelPickerOpen, modelPickerSearchValue, models, visibleModels: currentVisibleModels } = state
  const modelPickerOpen = !currentModelPickerOpen
  const visibleModels = currentModelPickerOpen ? models : currentVisibleModels
  return {
    ...state,
    modelPickerHeight: getModelPickerHeight(state.modelPickerHeaderHeight, visibleModels.length),
    modelPickerListScrollTop: 0,
    modelPickerOpen,
    modelPickerSearchValue: currentModelPickerOpen ? '' : modelPickerSearchValue,
    visibleModels,
    focus: 'model-picker-input',
  }
}
