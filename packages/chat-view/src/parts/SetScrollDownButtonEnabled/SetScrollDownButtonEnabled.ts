import type { ChatState } from '../ChatState/ChatState.ts'

export const setScrollDownButtonEnabled = (state: ChatState, scrollDownButtonEnabled: boolean): ChatState => {
  return {
    ...state,
    scrollDownButtonEnabled,
  }
}
