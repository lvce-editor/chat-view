import type { ChatState } from '../ChatState/ChatState.ts'
import { getSavedBounds } from '../GetSavedBounds/GetSavedBounds.ts'
import { getSavedSelectedModelId } from '../GetSavedSelectedModelId/GetSavedSelectedModelId.ts'
import { getSavedSelectedSessionId } from '../GetSavedSelectedSessionId/GetSavedSelectedSessionId.ts'
import { getSavedSessions } from '../GetSavedSessions/GetSavedSessions.ts'
import { getSavedViewMode } from '../GetSavedViewMode/GetSavedViewMode.ts'

export const loadContent = async (state: ChatState, savedState: unknown): Promise<ChatState> => {
  const savedBounds = getSavedBounds(savedState)
  const savedSelectedModelId = getSavedSelectedModelId(savedState)
  const savedViewMode = getSavedViewMode(savedState)
  const sessions = getSavedSessions(savedState) || state.sessions
  const preferredSessionId = getSavedSelectedSessionId(savedState) || state.selectedSessionId
  const preferredModelId = savedSelectedModelId || state.selectedModelId
  const selectedModelId = state.models.some((model) => model.id === preferredModelId) ? preferredModelId : state.models[0]?.id || ''
  const selectedSessionId = sessions.some((session) => session.id === preferredSessionId) ? preferredSessionId : sessions[0]?.id || ''
  const preferredViewMode = savedViewMode || state.viewMode
  const viewMode = sessions.length === 0 ? 'list' : preferredViewMode === 'detail' ? 'detail' : 'list'
  return {
    ...state,
    ...savedBounds,
    initial: false,
    selectedModelId,
    selectedSessionId,
    sessions,
    viewMode,
  }
}
