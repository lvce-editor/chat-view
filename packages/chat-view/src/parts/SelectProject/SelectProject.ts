import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'
import { refreshGitBranchPickerVisibility } from '../RefreshGitBranchPickerVisibility/RefreshGitBranchPickerVisibility.ts'

export const selectProject = async (state: ChatState, projectId: string): Promise<ChatState> => {
  const { selectedProjectId, selectedSessionId, sessions, viewMode, width } = state
  if (!projectId || selectedProjectId === projectId) {
    return state
  }
  const visibleSessions = getVisibleSessions(sessions, projectId, state.sessionPinningEnabled)
  if (visibleSessions.length === 0) {
    return refreshGitBranchPickerVisibility({
      ...state,
      composerAttachments: [],
      composerAttachmentsHeight: 0,
      selectedProjectId: projectId,
      selectedSessionId: '',
      viewMode: viewMode === 'chat-focus' ? 'chat-focus' : 'list',
    })
  }
  const currentSessionVisible = visibleSessions.some((session) => session.id === selectedSessionId)
  const nextSelectedSessionId = currentSessionVisible ? selectedSessionId : visibleSessions[0].id
  const loadedSession = await getChatSession(nextSelectedSessionId)
  const composerAttachments = await getComposerAttachments(nextSelectedSessionId)
  const hydratedSessions = sessions.map((session) => {
    if (session.id !== nextSelectedSessionId || !loadedSession) {
      return session
    }
    return loadedSession
  })
  return refreshGitBranchPickerVisibility({
    ...state,
    composerAttachments,
    composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, width),
    selectedProjectId: projectId,
    selectedSessionId: nextSelectedSessionId,
    sessions: hydratedSessions,
    viewMode: viewMode === 'chat-focus' ? 'chat-focus' : 'detail',
  })
}
