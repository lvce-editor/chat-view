import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const toggleProjectExpanded = async (state: ChatState, projectId: string): Promise<ChatState> => {
  const { projectExpandedIds, selectedSessionId, sessions, width } = state
  const isExpanded = projectExpandedIds.includes(projectId)
  const nextProjectExpandedIds = isExpanded ? projectExpandedIds.filter((id) => id !== projectId) : [...projectExpandedIds, projectId]

  const visibleSessions = getVisibleSessions(sessions, projectId)
  if (visibleSessions.length === 0) {
    return {
      ...state,
      composerAttachments: [],
      composerAttachmentsHeight: 0,
      listSelectedSessionId: '',
      projectExpandedIds: nextProjectExpandedIds,
      selectedProjectId: projectId,
      selectedSessionId: '',
      viewMode: 'chat-focus',
    }
  }

  const selectedSessionVisible = visibleSessions.some((session) => session.id === selectedSessionId)
  const nextSelectedSessionId = selectedSessionVisible ? selectedSessionId : visibleSessions[0].id
  const loadedSession = await getChatSession(nextSelectedSessionId)
  const composerAttachments = await getComposerAttachments(nextSelectedSessionId)
  const hydratedSessions = sessions.map((session) => {
    if (session.id !== nextSelectedSessionId || !loadedSession) {
      return session
    }
    return loadedSession
  })

  return {
    ...state,
    composerAttachments,
    composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, width),
    listSelectedSessionId: nextSelectedSessionId,
    projectExpandedIds: nextProjectExpandedIds,
    selectedProjectId: projectId,
    selectedSessionId: nextSelectedSessionId,
    sessions: hydratedSessions,
    viewMode: 'chat-focus',
  }
}
