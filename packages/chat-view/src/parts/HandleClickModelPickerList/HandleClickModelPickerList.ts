import type { ChatState } from '../ChatState/ChatState.ts'
import { getModelPickerClickIndex } from '../GetModelPickerClickIndex/GetModelPickerClickIndex.ts'
import { handleClickModelPickerListIndex } from '../HandleClickModelPickerListIndex/HandleClickModelPickerListIndex.ts'

export const handleClickModelPickerList = async (state: ChatState, eventY = 0): Promise<ChatState> => {
  const { height, y } = state
  const itemHeight = 28
  const offset = 90
  const index = getModelPickerClickIndex(y, height, eventY, offset, itemHeight)
  return handleClickModelPickerListIndex(state, index)
}
