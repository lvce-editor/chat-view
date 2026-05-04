import type { ChatState } from '../ChatState/ChatState.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const chatListFocusLast = async (state: ChatState): Promise<ChatState> => {
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId, state.searchValue)
  const lastVisibleSession = visibleSessions.at(-1)
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
  return {
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: visibleSessions.length - 1,
    listFocusOutline: false,
    listSelectedSessionId: lastVisibleSession.id,
  }
}
