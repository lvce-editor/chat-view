import type { ChatState } from '../ChatState/ChatState.ts'
import { getListIndex } from '../GetListIndex/GetListIndex.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'
import { selectListIndex } from '../SelectListIndex/SelectListIndex.ts'

export const handleClickList = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  const index = getListIndex(state, eventX, eventY)
  if (index === -1) {
    return {
      ...state,
      focus: 'list',
      focused: true,
      listFocusedIndex: -1,
      listFocusOutline: false,
    }
  }
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId, state.sessionPinningEnabled)
  if (index >= visibleSessions.length) {
    return {
      ...state,
      focus: 'list',
      focused: true,
      listFocusedIndex: -1,
      listFocusOutline: false,
    }
  }
  return selectListIndex(state, index)
}
