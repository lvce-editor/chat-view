import type { ChatState } from '../ChatState/ChatState.ts'
import { deleteChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const handleClickChatListArchiveAll = async (state: ChatState): Promise<ChatState> => {
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId)
  if (visibleSessions.length === 0) {
    return state
  }
  const visibleSessionIds = new Set(visibleSessions.map((session) => session.id))
  for (const session of visibleSessions) {
    await deleteChatSession(session.id)
  }
  const sessions = state.sessions.filter((session) => !visibleSessionIds.has(session.id))
  return {
    ...state,
    composerAttachments: [],
    composerAttachmentsHeight: 0,
    listFocusedIndex: -1,
    listFocusOutline: false,
    messages: [],
    renamingSessionId: visibleSessionIds.has(state.renamingSessionId) ? '' : state.renamingSessionId,
    selectedSessionId: '',
    sessions,
    viewMode: 'list',
  }
}
