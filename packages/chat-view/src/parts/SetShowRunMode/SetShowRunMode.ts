import type { ChatState } from '../ChatState/ChatState.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const setShowRunMode = (state: ChatState, showRunMode: boolean): ChatState => {
  return {
    ...state,
    showRunMode,
  }
}
