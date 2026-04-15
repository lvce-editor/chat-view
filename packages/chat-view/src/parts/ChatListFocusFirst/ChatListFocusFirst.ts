import type { ChatState } from '../ChatState/ChatState.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const chatListFocusFirst = async (state: ChatState): Promise<ChatState> => {
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
  return {
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: 0,
    listFocusOutline: false,
  }
}
