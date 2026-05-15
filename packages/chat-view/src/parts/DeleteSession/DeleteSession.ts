import type { ChatState } from '../ChatState/ChatState.ts'
import { deleteChatSession, getChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getNextSelectedSessionId } from '../GetNextSelectedSessionId/GetNextSelectedSessionId.ts'
import { toSummarySession } from '../ToSummarySession/ToSummarySession.ts'

export const deleteSession = async (state: ChatState, id: string): Promise<ChatState> => {
  const { renamingSessionId, sessions, width } = state
  const filtered = sessions.filter((session) => session.id !== id)
  if (filtered.length === sessions.length) {
    return state
  }
  await deleteChatSession(id)
  if (filtered.length === 0) {
    return {
      ...state,
      composerAttachments: [],
      composerAttachmentsHeight: 0,
      messages: [],
      renamingSessionId: '',
      selectedSessionId: '',
      sessions: [],
      viewMode: 'list',
    }
  }
  const nextSelectedSessionId = getNextSelectedSessionId(filtered, id)
  const loadedSession = await getChatSession(nextSelectedSessionId)
  const composerAttachments = await getComposerAttachments(nextSelectedSessionId)
  const nextSessions = loadedSession
    ? filtered.map((session) => {
        if (session.id !== nextSelectedSessionId) {
          return session
        }
        return toSummarySession(loadedSession)
      })
    : filtered
  return {
    ...state,
    composerAttachments,
    composerAttachmentsHeight: getComposerAttachmentsHeight(composerAttachments, width),
    messages: loadedSession?.messages || [],
    renamingSessionId: renamingSessionId === id ? '' : renamingSessionId,
    selectedSessionId: nextSelectedSessionId,
    sessions: nextSessions,
  }
}
