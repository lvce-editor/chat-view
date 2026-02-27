import type { ChatState } from '../StatusBarState/StatusBarState.ts'
import { getSavedBounds } from '../GetSavedBounds/GetSavedBounds.ts'
import { getSavedSelectedSessionId } from '../GetSavedSelectedSessionId/GetSavedSelectedSessionId.ts'
import { getSavedSessions } from '../GetSavedSessions/GetSavedSessions.ts'

export const loadContent = async (state: ChatState, savedState: unknown): Promise<ChatState> => {
  const savedBounds = getSavedBounds(savedState)
  const sessions = getSavedSessions(savedState) || state.sessions
  const preferredSessionId = getSavedSelectedSessionId(savedState) || state.selectedSessionId
  const selectedSessionId = sessions.some((session) => session.id === preferredSessionId) ? preferredSessionId : sessions[0]?.id || ''
  const viewMode = sessions.length === 0 ? 'list' : state.viewMode === 'detail' ? 'detail' : 'list'
  return {
    ...state,
    ...savedBounds,
    initial: false,
    selectedSessionId,
    sessions,
    viewMode,
  }
}
