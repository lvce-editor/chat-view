import type { ChatState } from '../../StatusBarState/StatusBarState.ts'
import { getNextSelectedSessionId } from '../GetNextSelectedSessionId/GetNextSelectedSessionId.ts'

export const deleteSession = (state: ChatState, id: string): ChatState => {
  const filtered = state.sessions.filter((session) => session.id !== id)
  if (filtered.length === state.sessions.length) {
    return state
  }
  if (filtered.length === 0) {
    return {
      ...state,
      renamingSessionId: '',
      selectedSessionId: '',
      sessions: [],
      viewMode: 'list',
    }
  }
  return {
    ...state,
    renamingSessionId: state.renamingSessionId === id ? '' : state.renamingSessionId,
    selectedSessionId: getNextSelectedSessionId(filtered, id),
    sessions: filtered,
  }
}
