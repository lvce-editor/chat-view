import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { withUpdatedDisplayMessages } from '../UpdateDisplayMessages/UpdateDisplayMessages.ts'

const getMockSession = (index: number): ChatSession => {
  const sessionNumber = index + 1
  return {
    id: `session-${sessionNumber}`,
    messages: [],
    title: `Chat ${sessionNumber}`,
  }
}

export const openMockSessions = async (state: ChatState, count: number): Promise<ChatState> => {
  if (!Number.isSafeInteger(count) || count < 0) {
    return state
  }
  const sessions = Array.from({ length: count }, (_, index) => getMockSession(index))
  return withUpdatedDisplayMessages({
    ...state,
    chatListScrollTop: 0,
    composerAttachments: [],
    composerAttachmentsHeight: 0,
    listFocusedIndex: -1,
    parsedMessages: [],
    renamingSessionId: '',
    selectedSessionId: '',
    sessions,
    viewMode: 'list',
  })
}
