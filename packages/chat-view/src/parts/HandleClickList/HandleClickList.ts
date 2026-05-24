import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatListTarget } from '../GetChatListTarget/GetChatListTarget.ts'
import { selectListIndex } from '../SelectListIndex/SelectListIndex.ts'

export const handleClickList = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  const target = getChatListTarget(state, eventX, eventY)
  if (target.type !== 'session') {
    return {
      ...state,
      focus: 'list',
      focused: true,
      listFocusedIndex: -1,
      listFocusOutline: false,
    }
  }
  return selectListIndex(state, target.sessionIndex)
}
