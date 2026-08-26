import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getNextAutoScrollTop } from '../GetNextAutoScrollTop/GetNextAutoScrollTop.ts'
import { parseAndStoreMessagesContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { refreshGitBranchPickerVisibility } from '../RefreshGitBranchPickerVisibility/RefreshGitBranchPickerVisibility.ts'
import { toSummarySession } from '../ToSummarySession/ToSummarySession.ts'

export const selectSession = async (state: ChatState, id: string): Promise<ChatState> => {
  const { lastNormalViewMode, sessions, viewMode, width } = state
  const exists = sessions.some((session) => session.id === id)
  if (!exists) {
    return state
  }
  const loadedSession = await getChatSession(id)
  const composerAttachments = await getComposerAttachments(id)
  const nextSessions = loadedSession
    ? sessions.map((session) => {
        if (session.id !== id) {
          return session
        }
        return toSummarySession(loadedSession)
      })
    : sessions
  const messages = loadedSession?.messages || []
  const parsedMessages = await parseAndStoreMessagesContent(state.parsedMessages, messages)
  return refreshGitBranchPickerVisibility({
    ...state,
    composerAttachments,
    composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, width),
    lastNormalViewMode: viewMode === 'chat-focus' ? lastNormalViewMode : 'detail',
    messages,
    messagesAutoScrollEnabled: true,
    messagesScrollTop: getNextAutoScrollTop(state.messagesScrollTop),
    parsedMessages,
    renamingSessionId: '',
    selectedSessionId: id,
    sessions: nextSessions,
    viewMode: viewMode === 'chat-focus' ? 'chat-focus' : 'detail',
  })
}
