import type { ChatState } from '../ChatState/ChatState.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const setAuthEnabled = (state: ChatState, authEnabled: boolean): ChatState => {
  return {
    ...state,
    authEnabled,
  }
}
