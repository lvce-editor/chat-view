import type { ChatState } from '../ChatState/ChatState.ts'
import { getModelPickerClickIndex } from '../GetModelPickerClickIndex/GetModelPickerClickIndex.ts'
import { handleClickModelPickerListIndex } from '../HandleClickModelPickerListIndex/HandleClickModelPickerListIndex.ts'
import { modelPickerBottomOffset } from '../ModelPickerBottomOffset/ModelPickerBottomOffset.ts'

export const handleClickModelPickerList = async (state: ChatState, eventY: number): Promise<ChatState> => {
  const { height, modelPickerHeight, modelPickerListScrollTop, y } = state
  const itemHeight = 28
  const headerHeight = 40
  const index = getModelPickerClickIndex(
    y,
    height,
    eventY,
    modelPickerBottomOffset,
    itemHeight,
    modelPickerHeight,
    headerHeight,
    modelPickerListScrollTop,
  )
  return handleClickModelPickerListIndex(state, index)
}
