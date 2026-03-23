import type { ChatState } from '../ChatState/ChatState.ts'
import { getModelPickerClickIndex } from '../GetModelPickerClickIndex/GetModelPickerClickIndex.ts'

export const handleClickModelPickerList = async (state: ChatState, eventY = 0): Promise<ChatState> => {
  const { height, modelPickerBottomOffset, modelPickerItemHeight, models, visibleModels, y } = state
  const index = getModelPickerClickIndex(y, height, eventY, modelPickerBottomOffset, modelPickerItemHeight)
  if (index < 0 || index >= visibleModels.length) {
    return state
  }
  return {
    ...state,
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    selectedModelId: visibleModels[index].id,
    visibleModels: models,
  }
}
