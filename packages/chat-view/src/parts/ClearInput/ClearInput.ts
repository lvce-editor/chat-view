import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const clearInput = async (state: ChatState): Promise<ChatState> => {
  return {
    ...state,
    composerValue: '',
  }
}
