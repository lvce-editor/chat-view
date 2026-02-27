import type { ChatState } from '../ChatState/ChatState.ts'

export const clearInput = async (state: ChatState): Promise<ChatState> => {
  return {
    ...state,
    composerValue: '',
  }
}
