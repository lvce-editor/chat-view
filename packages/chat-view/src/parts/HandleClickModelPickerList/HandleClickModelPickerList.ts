import type { ChatState } from '../ChatState/ChatState.ts'
import { getModelPickerClickIndex } from '../GetModelPickerClickIndex/GetModelPickerClickIndex.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'

export const handleClickModelPickerList = async (state: ChatState, eventY = 0): Promise<ChatState> => {
  const { height, models, visibleModels, y } = state
  const itemHeight = 28
  const offset = 90
  const index = getModelPickerClickIndex(y, height, eventY, offset, itemHeight)
  if (index < 0 || index >= visibleModels.length) {
    return state
  }
  return {
    ...state,
    modelPickerHeight: getModelPickerHeight(models.length),
    modelPickerOpen: false,
    modelPickerSearchValue: '',
    selectedModelId: visibleModels[index].id,
    visibleModels: models,
  }
}
