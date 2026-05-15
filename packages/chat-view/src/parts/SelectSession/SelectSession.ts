import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getNextAutoScrollTop } from '../GetNextAutoScrollTop/GetNextAutoScrollTop.ts'
import { parseAndStoreMessagesContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
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
  const selectedSession = hydratedSessions.find((session) => session.id === id)
  const parsedMessages = selectedSession ? await parseAndStoreMessagesContent(state.parsedMessages, selectedSession.messages) : state.parsedMessages
  return refreshGitBranchPickerVisibility({
    ...state,
    composerAttachments,
    composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, width),
    lastNormalViewMode: viewMode === 'chat-focus' ? lastNormalViewMode : 'detail',
    listSelectedSessionId: id,
    messagesAutoScrollEnabled: true,
    messagesScrollTop: getNextAutoScrollTop(state.messagesScrollTop),
    parsedMessages,
    renamingSessionId: '',
    selectedSessionId: id,
    sessions: hydratedSessions,
    viewMode: viewMode === 'chat-focus' ? 'chat-focus' : 'detail',
  })
}
