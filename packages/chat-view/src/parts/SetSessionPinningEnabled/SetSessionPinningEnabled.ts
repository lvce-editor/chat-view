import type { ChatState } from '../ChatState/ChatState.ts'

export const setSessionPinningEnabled = (state: ChatState, sessionPinningEnabled: boolean): ChatState => {
  return {
    ...state,
    sessionPinningEnabled,
  }
}
