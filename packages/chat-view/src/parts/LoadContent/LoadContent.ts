import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { listChatSessions, saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getSavedChatListScrollTop } from '../GetSavedChatListScrollTop/GetSavedChatListScrollTop.ts'
import { getSavedMessagesScrollTop } from '../GetSavedMessagesScrollTop/GetSavedMessagesScrollTop.ts'
import { getSavedSelectedModelId } from '../GetSavedSelectedModelId/GetSavedSelectedModelId.ts'
import { getSavedSelectedSessionId } from '../GetSavedSelectedSessionId/GetSavedSelectedSessionId.ts'
import { getSavedSessions } from '../GetSavedSessions/GetSavedSessions.ts'
import { getSavedViewMode } from '../GetSavedViewMode/GetSavedViewMode.ts'
import { loadPreferences } from '../LoadPreferences/LoadPreferences.ts'
import { loadSelectedSessionMessages } from '../LoadSelectedSessionMessages/LoadSelectedSessionMessages.ts'

const toSummarySession = (session: ChatSession): ChatSession => {
  return {
    id: session.id,
    messages: [],
    title: session.title,
  }
}

export const loadContent = async (state: ChatState, savedState: unknown): Promise<ChatState> => {
  const savedSelectedModelId = getSavedSelectedModelId(savedState)
  const savedViewMode = getSavedViewMode(savedState)
  const {
    aiSessionTitleGenerationEnabled,
    composerDropEnabled,
    emitStreamingFunctionCallEvents,
    openApiApiKey,
    openRouterApiKey,
    passIncludeObfuscation,
    streamingEnabled,
  } = await loadPreferences()
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
  const chatListScrollTop = getSavedChatListScrollTop(savedState) ?? state.chatListScrollTop
  const messagesScrollTop = getSavedMessagesScrollTop(savedState) ?? state.messagesScrollTop
  const selectedModelId = state.models.some((model) => model.id === preferredModelId) ? preferredModelId : state.models[0]?.id || ''
  const selectedSessionId = sessions.some((session) => session.id === preferredSessionId) ? preferredSessionId : sessions[0]?.id || ''
  sessions = await loadSelectedSessionMessages(sessions, selectedSessionId)
  const preferredViewMode = savedViewMode || state.viewMode
  const viewMode = sessions.length === 0 || !selectedSessionId ? 'list' : preferredViewMode === 'detail' ? 'detail' : 'list'
  return {
    ...state,
    aiSessionTitleGenerationEnabled,
    chatListScrollTop,
    composerDropActive: false,
    composerDropEnabled,
    emitStreamingFunctionCallEvents,
    initial: false,
    messagesScrollTop,
    openApiApiKey,
    openApiApiKeyInput: openApiApiKey,
    openRouterApiKey,
    openRouterApiKeyInput: openRouterApiKey,
    passIncludeObfuscation,
    selectedModelId,
    selectedSessionId,
    sessions,
    streamingEnabled,
    viewMode,
  }
}
