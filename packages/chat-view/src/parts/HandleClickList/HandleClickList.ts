import type { ChatState } from '../ChatState/ChatState.ts'
import { getListIndex } from '../GetListIndex/GetListIndex.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'
import { selectListIndex } from '../SelectListIndex/SelectListIndex.ts'

const getSessionIndexFromListIndex = (listIndex: number, sessionCount: number, expanded: boolean): number => {
  if (listIndex < 0) {
    return -1
  }
  if (sessionCount <= 3) {
    return listIndex < sessionCount ? listIndex : -1
  }
  if (listIndex < 3) {
    return listIndex
  }
  if (listIndex === 3) {
    return -1
  }
  if (!expanded) {
    return -1
  }
  const sessionIndex = listIndex - 1
  return sessionIndex < sessionCount ? sessionIndex : -1
}

export const handleClickList = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  const listIndex = getListIndex(state, eventX, eventY)
  if (listIndex === -1) {
    return {
      ...state,
      focus: 'list',
      focused: true,
      listFocusedIndex: -1,
      listFocusOutline: false,
    }
  }
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId)
  const sessionIndex = getSessionIndexFromListIndex(listIndex, visibleSessions.length, state.chatListExpanded)
  if (sessionIndex === -1) {
    return {
      ...state,
      focus: 'list',
      focused: true,
      listFocusedIndex: -1,
      listFocusOutline: false,
    }
  }
  return selectListIndex(state, sessionIndex)
}
