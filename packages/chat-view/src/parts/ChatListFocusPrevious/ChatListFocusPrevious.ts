import type { ChatState } from '../ChatState/ChatState.ts'
import { getListFocusIndex } from '../GetListFocusIndex/GetListFocusIndex.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const chatListFocusPrevious = async (state: ChatState): Promise<ChatState> => {
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId, state.searchValue)
  if (visibleSessions.length === 0) {
    return {
      ...state,
      focus: 'list',
      focused: true,
      listFocusedIndex: -1,
      listFocusOutline: false,
      listSelectedSessionId: '',
    }
  }
  const currentIndex = getListFocusIndex(state)
  const previousIndex = currentIndex === -1 ? visibleSessions.length - 1 : Math.max(currentIndex - 1, 0)
  return {
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: previousIndex,
    listFocusOutline: false,
    listSelectedSessionId: visibleSessions[previousIndex].id,
  }
}
