import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { refreshGitBranchPickerVisibility } from '../RefreshGitBranchPickerVisibility/RefreshGitBranchPickerVisibility.ts'

export const selectSession = async (state: ChatState, id: string): Promise<ChatState> => {
  const { lastNormalViewMode, sessions, viewMode, width } = state
  const exists = sessions.some((session) => session.id === id)
  if (!exists) {
    return state
  }
  const loadedSession = await getChatSession(id)
  const composerAttachments = await getComposerAttachments(id)
  const hydratedSessions = sessions.map((session) => {
    if (session.id !== id) {
      return session
    }
    if (!loadedSession) {
      return session
    }
    return loadedSession
  })
  return refreshGitBranchPickerVisibility({
    ...state,
    composerAttachments,
    composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, width),
    lastNormalViewMode: viewMode === 'chat-focus' ? lastNormalViewMode : 'detail',
    renamingSessionId: '',
    selectedSessionId: id,
    sessions: hydratedSessions,
    viewMode: viewMode === 'chat-focus' ? 'chat-focus' : 'detail',
  })
}
