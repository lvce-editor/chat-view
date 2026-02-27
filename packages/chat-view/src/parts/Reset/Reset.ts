import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const reset = async (state: ChatState): Promise<ChatState> => {
  return {
    ...state,
    composerValue: '',
    selectedSessionId: '',
    sessions: [],
    viewMode: 'list',
  }
}
