import type { ChatState } from '../ChatState/ChatState.ts'

export const reset = async (state: ChatState): Promise<ChatState> => {
  return {
    ...state,
    composerValue: '',
    selectedSessionId: '',
    sessions: [],
    viewMode: 'list',
  }
}
