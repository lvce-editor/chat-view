import type { ChatState } from '../ChatState/ChatState.ts'
import { selectListIndex } from '../SelectListIndex/SelectListIndex.ts'

export const chatListAccept = async (state: ChatState): Promise<ChatState> => {
  return selectListIndex(state, state.listFocusedIndex)
}
