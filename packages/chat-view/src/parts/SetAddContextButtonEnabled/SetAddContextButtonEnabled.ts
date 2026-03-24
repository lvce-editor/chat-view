import type { ChatState } from '../ChatState/ChatState.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const setAddContextButtonEnabled = (state: ChatState, addContextButtonEnabled: boolean): ChatState => {
  return {
    ...state,
    addContextButtonEnabled,
  }
}
