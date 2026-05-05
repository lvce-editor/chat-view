import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatSession, saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

const getBlankProjectId = (state: ChatState, removedProjectId: string): string => {
  return state.projects.find((project) => project.id !== removedProjectId && project.name === '_blank')?.id || ''
}

const getNextViewMode = (state: ChatState, hasSelectedSession: boolean): ChatState['viewMode'] => {
  if (state.viewMode === 'chat-focus') {
    return 'chat-focus'
  }
  if (!hasSelectedSession) {
    return 'list'
  }
  return state.viewMode === 'detail' ? 'detail' : 'list'
}

const ensureExpandedProject = (
  state: ChatState,
  projectExpandedIds: readonly string[],
  selectedProjectId: string,
  visibleSessions: readonly ChatSession[],
): readonly string[] => {
  if (state.viewMode !== 'chat-focus' || !selectedProjectId || visibleSessions.length === 0 || projectExpandedIds.includes(selectedProjectId)) {
    return projectExpandedIds
  }
  return [...projectExpandedIds, selectedProjectId]
}

export const deleteProject = async (state: ChatState, projectId: string): Promise<ChatState> => {
  const project = state.projects.find((candidate) => candidate.id === projectId)
  if (!project || project.name === '_blank') {
    return state
  }

  const blankProjectId = getBlankProjectId(state, projectId)
  if (!blankProjectId) {
    return state
  }

  const projects = state.projects.filter((candidate) => candidate.id !== projectId)
  const sessions = await Promise.all(
    state.sessions.map(async (session) => {
      if (session.projectId !== projectId) {
        return session
      }
      const updatedSession: ChatSession = {
        ...session,
        projectId: blankProjectId,
      }
      await saveChatSession(updatedSession)
      return updatedSession
    }),
  )

  const selectedProjectId =
    !state.selectedProjectId || state.selectedProjectId === projectId || !projects.some((candidate) => candidate.id === state.selectedProjectId)
      ? blankProjectId
      : state.selectedProjectId
  const projectExpandedIds = state.projectExpandedIds.filter(
    (expandedProjectId) => expandedProjectId !== projectId && projects.some((candidate) => candidate.id === expandedProjectId),
  )
  const visibleSessions = getVisibleSessions(sessions, selectedProjectId)
  const nextProjectExpandedIds = ensureExpandedProject(state, projectExpandedIds, selectedProjectId, visibleSessions)

  if (visibleSessions.length === 0) {
    return {
      ...state,
      composerAttachments: [],
      composerAttachmentsHeight: 0,
      listSelectedSessionId: '',
      projectExpandedIds: nextProjectExpandedIds,
      projects,
      selectedProjectId,
      selectedSessionId: '',
      sessions,
      viewMode: getNextViewMode(state, false),
    }
  }

  const selectedSessionId = visibleSessions.some((session) => session.id === state.selectedSessionId)
    ? state.selectedSessionId
    : visibleSessions[0].id
  const loadedSession = await getChatSession(selectedSessionId)
  const composerAttachments = await getComposerAttachments(selectedSessionId)
  const hydratedSessions = sessions.map((session) => {
    if (session.id !== selectedSessionId || !loadedSession) {
      return session
    }
    return loadedSession
  })

  return {
    ...state,
    composerAttachments,
    composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, state.width),
    listSelectedSessionId: selectedSessionId,
    projectExpandedIds: nextProjectExpandedIds,
    projects,
    selectedProjectId,
    selectedSessionId,
    sessions: hydratedSessions,
    viewMode: getNextViewMode(state, true),
  }
}
