import type { ChatState } from '../ChatState/ChatState.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'

export const handleModelChange = async (state: ChatState, value: string): Promise<ChatState> => {
  return {
    ...state,
    modelPickerHeight: getModelPickerHeight(state.modelPickerHeaderHeight, state.models.length),
    modelPickerListScrollTop: 0,
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    reasoningEffortPickerOpen: false,
    selectedModelId: value,
    visibleModels: state.models,
  }
}
