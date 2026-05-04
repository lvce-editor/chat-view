import type { ChatState } from '../ChatState/ChatState.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const getListFocusIndex = (state: ChatState): number => {
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId, state.searchValue)
  if (visibleSessions.length === 0) {
    return -1
  }
  if (state.listFocusedIndex >= 0 && state.listFocusedIndex < visibleSessions.length) {
    return state.listFocusedIndex
  }
  if (!state.listSelectedSessionId) {
    return -1
  }
  return visibleSessions.findIndex((session) => session.id === state.listSelectedSessionId)
}
