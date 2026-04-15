import type { ChatState } from '../ChatState/ChatState.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'

export const handleModelInputBlur = async (state: ChatState): Promise<ChatState> => {
  if (!state.modelPickerOpen) {
    return state
  }
  return {
    ...state,
    focus: 'composer',
    focused: true,
    listFocusedIndex: -1,
    modelPickerHeight: getModelPickerHeight(state.modelPickerHeaderHeight, state.models.length),
    modelPickerListScrollTop: 0,
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    visibleModels: state.models,
  }
}
