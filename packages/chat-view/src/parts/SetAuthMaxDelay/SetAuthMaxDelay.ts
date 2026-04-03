import type { ChatState } from '../ChatState/ChatState.ts'

export const setAuthMaxDelay = (state: ChatState, authMaxDelay: number): ChatState => {
  return {
    ...state,
    authMaxDelay: Math.max(0, authMaxDelay),
  }
}