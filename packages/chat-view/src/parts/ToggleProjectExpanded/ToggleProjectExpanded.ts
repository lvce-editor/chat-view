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
      messages: [],
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

  return {
    ...state,
    composerAttachments,
    composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, width),
    messages: loadedSession?.messages || [],
    projectExpandedIds: nextProjectExpandedIds,
    selectedProjectId: projectId,
    selectedSessionId: nextSelectedSessionId,
    viewMode: 'chat-focus',
  }
}
