import type { ChatState } from '../ChatState/ChatState.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'

export const handleClickModelPickerListIndex = async (state: ChatState, index: number): Promise<ChatState> => {
  const { models, visibleModels } = state
  if (index < 0 || index >= visibleModels.length) {
    return state
  }
  return {
    ...state,
    modelPickerHeight: getModelPickerHeight(models.length),
    modelPickerListScrollTop: 0,
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    selectedModelId: visibleModels[index].id,
    visibleModels: models,
  }
}
