import type { ChatState } from '../../StatusBarState/StatusBarState.ts'
import { getNextSelectedSessionId } from '../GetNextSelectedSessionId/GetNextSelectedSessionId.ts'

export const deleteSession = (state: ChatState, id: string): ChatState => {
  const { renamingSessionId, sessions } = state
  const filtered = sessions.filter((session) => session.id !== id)
  if (filtered.length === sessions.length) {
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
    renamingSessionId: renamingSessionId === id ? '' : renamingSessionId,
    selectedSessionId: getNextSelectedSessionId(filtered, id),
    sessions: filtered,
  }
}
