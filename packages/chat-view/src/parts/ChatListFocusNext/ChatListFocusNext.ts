import type { ChatState } from '../ChatState/ChatState.ts'
import { getListFocusIndex } from '../GetListFocusIndex/GetListFocusIndex.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const chatListFocusNext = async (state: ChatState): Promise<ChatState> => {
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId, state.sessionPinningEnabled)
  if (visibleSessions.length === 0) {
    return {
      ...state,
      focus: 'list',
      focused: true,
      listFocusedIndex: -1,
      listFocusOutline: false,
    }
  }
  const currentIndex = getListFocusIndex(state)
  const nextIndex = currentIndex === -1 ? 0 : Math.min(currentIndex + 1, visibleSessions.length - 1)
  return {
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: nextIndex,
    listFocusOutline: false,
  }
}
