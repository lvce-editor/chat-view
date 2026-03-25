import type { ChatState } from '../ChatState/ChatState.ts'
import { getModelPickerClickIndex } from '../GetModelPickerClickIndex/GetModelPickerClickIndex.ts'
import { handleClickModelPickerListIndex } from '../HandleClickModelPickerListIndex/HandleClickModelPickerListIndex.ts'

export const handlePointerUpModelPickerList = async (state: ChatState, eventY = 0): Promise<ChatState> => {
  const { height, modelPickerHeight, modelPickerListScrollTop, y } = state
  const itemHeight = 28
  const bottomOffset = 90
  const headerHeight = 40
  const index = getModelPickerClickIndex(y, height, eventY, bottomOffset, itemHeight, modelPickerHeight, headerHeight, modelPickerListScrollTop)
  return handleClickModelPickerListIndex(state, index)
}
