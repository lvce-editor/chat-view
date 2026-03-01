import type { ChatState } from '../ChatState/ChatState.ts'
import { clearChatSessions } from '../ChatSessionStorage/ChatSessionStorage.ts'

export const reset = async (state: ChatState): Promise<ChatState> => {
  await clearChatSessions()
  return {
    ...state,
    composerValue: '',
    selectedSessionId: '',
    sessions: [],
    viewMode: 'list',
  }
}
