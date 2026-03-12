import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { listChatSessions, saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getSavedChatListScrollTop } from '../GetSavedChatListScrollTop/GetSavedChatListScrollTop.ts'
import { getSavedMessagesScrollTop } from '../GetSavedMessagesScrollTop/GetSavedMessagesScrollTop.ts'
import { getSavedSelectedModelId } from '../GetSavedSelectedModelId/GetSavedSelectedModelId.ts'
import { getSavedSelectedSessionId } from '../GetSavedSelectedSessionId/GetSavedSelectedSessionId.ts'
import { getSavedSessions } from '../GetSavedSessions/GetSavedSessions.ts'
import { getSavedViewMode } from '../GetSavedViewMode/GetSavedViewMode.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'
import { isObject } from '../IsObject/IsObject.ts'
import { loadPreferences } from '../LoadPreferences/LoadPreferences.ts'
import { loadSelectedSessionMessages } from '../LoadSelectedSessionMessages/LoadSelectedSessionMessages.ts'

const toSummarySession = (session: ChatSession): ChatSession => {
  const summary: ChatSession = {
    id: session.id,
    messages: [],
    title: session.title,
  }
  if (!session.projectId) {
    return summary
  }
  return {
    ...summary,
    projectId: session.projectId,
  }
}

const getSavedSelectedProjectId = (savedState: unknown): string | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { selectedProjectId } = savedState
  if (typeof selectedProjectId !== 'string') {
    return undefined
  }
  return selectedProjectId
}

const getSavedProjects = (savedState: unknown): readonly { id: string; name: string; uri: string }[] | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { projects } = savedState
  if (!Array.isArray(projects)) {
    return undefined
  }
  const validProjects = projects.filter((project) => {
    if (!isObject(project)) {
      return false
    }
    return typeof project.id === 'string' && typeof project.name === 'string' && typeof project.uri === 'string'
  }) as readonly { id: string; name: string; uri: string }[]
  if (validProjects.length === 0) {
    return undefined
  }
  return validProjects
}

const ensureBlankProject = (
  projects: readonly Readonly<{ id: string; name: string; uri: string }>[],
  fallbackBlankProject: Readonly<{ id: string; name: string; uri: string }>,
): readonly { id: string; name: string; uri: string }[] => {
  if (projects.some((project: Readonly<{ id: string; name: string; uri: string }>) => project.name === '_blank')) {
    return projects
  }
  return [fallbackBlankProject, ...projects]
}

const getSavedProjectListScrollTop = (savedState: unknown): number | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { projectListScrollTop } = savedState
  if (typeof projectListScrollTop !== 'number') {
    return undefined
  }
  return projectListScrollTop
}

const getSavedProjectExpandedIds = (savedState: unknown): readonly string[] | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { projectExpandedIds } = savedState
  if (!Array.isArray(projectExpandedIds)) {
    return undefined
  }
  const ids = projectExpandedIds.filter((id) => typeof id === 'string') as readonly string[]
  if (ids.length === 0) {
    return undefined
  }
  return ids
}

const getSavedLastNormalViewMode = (savedState: unknown): 'list' | 'detail' | undefined => {
  if (!isObject(savedState)) {
    return undefined
  }
  const { lastNormalViewMode } = savedState
  if (lastNormalViewMode !== 'list' && lastNormalViewMode !== 'detail') {
    return undefined
  }
  return lastNormalViewMode
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
    useChatNetworkWorkerForRequests,
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
    useChatNetworkWorkerForRequests,
    viewMode,
  }
}
