import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatSession, listChatSessions, saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getSavedBounds } from '../GetSavedBounds/GetSavedBounds.ts'
import { getSavedSelectedModelId } from '../GetSavedSelectedModelId/GetSavedSelectedModelId.ts'
import { getSavedSelectedSessionId } from '../GetSavedSelectedSessionId/GetSavedSelectedSessionId.ts'
import { getSavedSessions } from '../GetSavedSessions/GetSavedSessions.ts'
import { getSavedViewMode } from '../GetSavedViewMode/GetSavedViewMode.ts'

const toSummarySession = (session: ChatSession): ChatSession => {
  return {
    id: session.id,
    messages: [],
    title: session.title,
  }
}

const loadSelectedSessionMessages = async (sessions: readonly ChatSession[], selectedSessionId: string): Promise<readonly ChatSession[]> => {
  if (!selectedSessionId) {
    return sessions
  }
  const loadedSession = await getChatSession(selectedSessionId)
  if (!loadedSession) {
    return sessions
  }
  return sessions.map((session) => {
    if (session.id !== selectedSessionId) {
      return session
    }
    return loadedSession
  })
}

export const loadContent = async (state: ChatState, savedState: unknown): Promise<ChatState> => {
  const savedBounds = getSavedBounds(savedState)
  const savedSelectedModelId = getSavedSelectedModelId(savedState)
  const savedViewMode = getSavedViewMode(savedState)
  const legacySavedSessions = getSavedSessions(savedState)
  const storedSessions = await listChatSessions()
  let sessions: readonly ChatSession[] = storedSessions
  if (sessions.length === 0 && legacySavedSessions && legacySavedSessions.length > 0) {
    for (const session of legacySavedSessions) {
      await saveChatSession(session)
    }
    sessions = legacySavedSessions.map(toSummarySession)
  }
  if (sessions.length === 0 && state.sessions.length > 0) {
    for (const session of state.sessions) {
      await saveChatSession(session)
    }
    sessions = state.sessions.map(toSummarySession)
  }
  const preferredSessionId = getSavedSelectedSessionId(savedState) || state.selectedSessionId
  const preferredModelId = savedSelectedModelId || state.selectedModelId
  const selectedModelId = state.models.some((model) => model.id === preferredModelId) ? preferredModelId : state.models[0]?.id || ''
  const selectedSessionId = sessions.some((session) => session.id === preferredSessionId) ? preferredSessionId : sessions[0]?.id || ''
  sessions = await loadSelectedSessionMessages(sessions, selectedSessionId)
  const preferredViewMode = savedViewMode || state.viewMode
  const viewMode = sessions.length === 0 || !selectedSessionId ? 'list' : preferredViewMode === 'detail' ? 'detail' : 'list'
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
