import type { ChatState } from '../StatusBarState/StatusBarState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'
import { ensureSessions } from '../EnsureSessions/EnsureSessions.ts'

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const getSavedSessions = (savedState: unknown) => {
  if (!isObject(savedState)) {
    return undefined
  }
  const sessions = (savedState as Partial<SavedState>).sessions
  if (!Array.isArray(sessions)) {
    return undefined
  }
  return sessions
}

const getSavedSelectedSessionId = (savedState: unknown) => {
  if (!isObject(savedState)) {
    return undefined
  }
  const selectedSessionId = (savedState as Partial<SavedState>).selectedSessionId
  if (typeof selectedSessionId !== 'string') {
    return undefined
  }
  return selectedSessionId
}

export const loadContent = async (state: ChatState, savedState: unknown): Promise<ChatState> => {
  const sourceSessions = getSavedSessions(savedState) || state.sessions
  const sessions = sourceSessions.length > 0 ? sourceSessions : ensureSessions(state)
  const preferredSessionId = getSavedSelectedSessionId(savedState) || state.selectedSessionId
  const selectedSessionId = sessions.some((session) => session.id === preferredSessionId) ? preferredSessionId : sessions[0].id
  const viewMode = state.viewMode === 'detail' ? 'detail' : 'list'
  return {
    ...state,
    initial: false,
    nextSessionId: state.sessions.length === 0 ? state.nextSessionId + 1 : state.nextSessionId,
    selectedSessionId,
    sessions,
    viewMode,
  }
}
