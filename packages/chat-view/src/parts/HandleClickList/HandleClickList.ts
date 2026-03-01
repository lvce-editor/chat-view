import type { ChatState } from '../ChatState/ChatState.ts'
import { getListIndex } from '../GetListIndex/GetListIndex.ts'
import { selectListIndex } from '../SelectListIndex/SelectListIndex.ts'

export const handleClickList = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  const index = getListIndex(state, eventX, eventY)
  return selectListIndex(state, index)
}
