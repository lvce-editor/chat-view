import type { ChatState } from '../ChatState/ChatState.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'

export const FocusModelPickerInput = 912_444

export const openModelPicker = (state: ChatState): ChatState => {
  const { modelPickerOpen: currentModelPickerOpen, modelPickerSearchValue, models, visibleModels: currentVisibleModels } = state
  const modelPickerOpen = !currentModelPickerOpen
  const visibleModels = currentModelPickerOpen ? models : currentVisibleModels
  return {
    ...state,
    agentModePickerOpen: false,
    focus: modelPickerOpen ? 'model-picker-input' : state.focus,
    focused: modelPickerOpen ? true : state.focused,
    modelPickerHeight: getModelPickerHeight(state.modelPickerHeaderHeight, visibleModels.length),
    modelPickerListScrollTop: 0,
    modelPickerOpen,
    modelPickerSearchValue: currentModelPickerOpen ? '' : modelPickerSearchValue,
    reasoningEffortPickerOpen: false,
    runModePickerOpen: false,
    visibleModels,
  }
}
