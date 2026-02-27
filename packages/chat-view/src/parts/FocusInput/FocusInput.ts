import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const focusInput = (state: ChatState): ChatState => {
  return {
    ...state,
    focus: 'composer',
    focused: true,
  }
}
