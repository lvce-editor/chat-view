import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const diffFocus = (oldState: ChatState, newState: ChatState): boolean => {
  if (!newState.focused) {
    return true
  }
  return oldState.focus === newState.focus && oldState.focused === newState.focused
}
