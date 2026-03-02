import type { ChatState } from '../ChatState/ChatState.ts'
import { clearChatSessions } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getMinComposerHeightForState } from '../GetComposerHeight/GetComposerHeight.ts'

export const reset = async (state: ChatState): Promise<ChatState> => {
  await clearChatSessions()
  return {
    ...state,
    composerHeight: getMinComposerHeightForState(state),
    composerValue: '',
    openRouterApiKey: '',
    selectedSessionId: '',
    sessions: [],
    viewMode: 'list',
  }
}
