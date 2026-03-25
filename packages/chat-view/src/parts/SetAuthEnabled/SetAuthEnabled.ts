import type { ChatState } from '../ChatState/ChatState.ts'

export const setAuthEnabled = (state: ChatState, authEnabled: boolean): ChatState => {
  return {
    ...state,
    authEnabled,
  }
}
