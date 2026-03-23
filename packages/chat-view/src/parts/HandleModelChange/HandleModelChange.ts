import type { ChatState } from '../ChatState/ChatState.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'

export const handleModelChange = async (state: ChatState, value: string): Promise<ChatState> => {
  return {
    ...state,
    modelPickerHeight: getModelPickerHeight(state.models.length),
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    selectedModelId: value,
    visibleModels: state.models,
  }
}
