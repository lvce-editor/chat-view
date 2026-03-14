import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { ensureBlankProject } from '../EnsureBlankProject/EnsureBlankProject.ts'
import { getSavedLastNormalViewMode } from '../GetSavedLastNormalViewMode/GetSavedLastNormalViewMode.ts'
import { listChatSessions, saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getSavedChatListScrollTop } from '../GetSavedChatListScrollTop/GetSavedChatListScrollTop.ts'
import { getSavedMessagesScrollTop } from '../GetSavedMessagesScrollTop/GetSavedMessagesScrollTop.ts'
import { getSavedProjectExpandedIds } from '../GetSavedProjectExpandedIds/GetSavedProjectExpandedIds.ts'
import { getSavedProjectListScrollTop } from '../GetSavedProjectListScrollTop/GetSavedProjectListScrollTop.ts'
import { getSavedProjects } from '../GetSavedProjects/GetSavedProjects.ts'
import { getSavedSelectedProjectId } from '../GetSavedSelectedProjectId/GetSavedSelectedProjectId.ts'
import { getSavedSelectedModelId } from '../GetSavedSelectedModelId/GetSavedSelectedModelId.ts'
import { getSavedSelectedSessionId } from '../GetSavedSelectedSessionId/GetSavedSelectedSessionId.ts'
import { getSavedSessions } from '../GetSavedSessions/GetSavedSessions.ts'
import { getSavedViewMode } from '../GetSavedViewMode/GetSavedViewMode.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'
import { loadPreferences } from '../LoadPreferences/LoadPreferences.ts'
import { loadSelectedSessionMessages } from '../LoadSelectedSessionMessages/LoadSelectedSessionMessages.ts'
import { toSummarySession } from '../ToSummarySession/ToSummarySession.ts'

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
    useChatMathWorker,
    useChatNetworkWorkerForRequests,
    voiceDictationEnabled,
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
  const savedProjects = getSavedProjects(savedState)
  const baseProjects = savedProjects && savedProjects.length > 0 ? savedProjects : state.projects
  const blankProject = state.projects.find((project) => project.name === '_blank') || { id: 'project-blank', name: '_blank', uri: '' }
  const projects = ensureBlankProject(baseProjects, blankProject)
  const preferredProjectId = getSavedSelectedProjectId(savedState) || state.selectedProjectId
  const selectedProjectId = projects.some((project: Readonly<{ id: string; name: string; uri: string }>) => project.id === preferredProjectId)
    ? preferredProjectId
    : projects[0]?.id || ''
  const preferredModelId = savedSelectedModelId || state.selectedModelId
  const chatListScrollTop = getSavedChatListScrollTop(savedState) ?? state.chatListScrollTop
  const messagesScrollTop = getSavedMessagesScrollTop(savedState) ?? state.messagesScrollTop
  const projectListScrollTop = getSavedProjectListScrollTop(savedState) ?? state.projectListScrollTop
  const savedProjectExpandedIds = getSavedProjectExpandedIds(savedState)
  const projectExpandedIds = (savedProjectExpandedIds || state.projectExpandedIds).filter((id) =>
    projects.some((project: Readonly<{ id: string; name: string; uri: string }>) => project.id === id),
  )
  const selectedModelId = state.models.some((model) => model.id === preferredModelId) ? preferredModelId : state.models[0]?.id || ''
  const visibleSessions = getVisibleSessions(sessions, selectedProjectId)
  const selectedSessionId = visibleSessions.some((session) => session.id === preferredSessionId) ? preferredSessionId : visibleSessions[0]?.id || ''
  sessions = await loadSelectedSessionMessages(sessions, selectedSessionId)
  const preferredViewMode = savedViewMode || state.viewMode
  const savedLastNormalViewMode = getSavedLastNormalViewMode(savedState)
  const lastNormalViewMode = savedLastNormalViewMode || (preferredViewMode === 'detail' ? 'detail' : state.lastNormalViewMode)
  const viewMode = sessions.length === 0 || !selectedSessionId ? 'list' : preferredViewMode
  return {
    ...state,
    aiSessionTitleGenerationEnabled,
    chatListScrollTop,
    composerDropActive: false,
    composerDropEnabled,
    emitStreamingFunctionCallEvents,
    initial: false,
    lastNormalViewMode,
    messagesScrollTop,
    openApiApiKey,
    openApiApiKeyInput: openApiApiKey,
    openRouterApiKey,
    openRouterApiKeyInput: openRouterApiKey,
    passIncludeObfuscation,
    projectExpandedIds,
    projectListScrollTop,
    projects,
    selectedModelId,
    selectedProjectId,
    selectedSessionId,
    sessions,
    streamingEnabled,
    useChatMathWorker,
    useChatNetworkWorkerForRequests,
    viewMode,
    voiceDictationEnabled,
  }
}
