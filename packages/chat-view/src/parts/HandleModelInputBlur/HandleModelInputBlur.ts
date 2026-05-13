import type { ChatState } from '../ChatState/ChatState.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'

export const handleModelInputBlur = async (state: ChatState): Promise<ChatState> => {
  const { modelPickerHeaderHeight, modelPickerOpen, models } = state

  if (!modelPickerOpen) {
    return state
  }
  return {
    ...state,
    focus: 'composer',
    focused: true,
    listFocusedIndex: -1,
    listFocusOutline: false,
    modelPickerHeight: getModelPickerHeight(modelPickerHeaderHeight, models.length),
    modelPickerListScrollTop: 0,
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    visibleModels: models,
  }
}
