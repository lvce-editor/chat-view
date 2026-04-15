import type { ChatState } from '../ChatState/ChatState.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const chatListFocusLast = async (state: ChatState): Promise<ChatState> => {
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId)
  if (visibleSessions.length === 0) {
    return {
      ...state,
      focus: 'list',
      focused: true,
      listFocusOutline: false,
      listFocusedIndex: -1,
    }
  }
  return {
    ...state,
    focus: 'list',
    focused: true,
    listFocusOutline: false,
    listFocusedIndex: visibleSessions.length - 1,
  }
}
