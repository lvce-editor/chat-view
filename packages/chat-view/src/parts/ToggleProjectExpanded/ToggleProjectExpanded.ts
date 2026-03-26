import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const toggleProjectExpanded = async (state: ChatState, projectId: string): Promise<ChatState> => {
  const isExpanded = state.projectExpandedIds.includes(projectId)
  const projectExpandedIds = isExpanded ? state.projectExpandedIds.filter((id) => id !== projectId) : [...state.projectExpandedIds, projectId]

  const visibleSessions = getVisibleSessions(state.sessions, projectId)
  if (visibleSessions.length === 0) {
    return {
      ...state,
      composerAttachments: [],
      projectExpandedIds,
      selectedProjectId: projectId,
      selectedSessionId: '',
      viewMode: 'chat-focus',
    }
  }

  const selectedSessionVisible = visibleSessions.some((session) => session.id === state.selectedSessionId)
  const selectedSessionId = selectedSessionVisible ? state.selectedSessionId : visibleSessions[0].id
  const loadedSession = await getChatSession(selectedSessionId)
  const composerAttachments = await getComposerAttachments(selectedSessionId)
  const sessions = state.sessions.map((session) => {
    if (session.id !== selectedSessionId || !loadedSession) {
      return session
    }
    return loadedSession
  })

  return {
    ...state,
    composerAttachments,
    projectExpandedIds,
    selectedProjectId: projectId,
    selectedSessionId,
    sessions,
    viewMode: 'chat-focus',
  }
}
