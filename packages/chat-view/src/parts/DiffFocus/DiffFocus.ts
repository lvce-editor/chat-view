import type { ChatState } from '../ChatState/ChatState.ts'

export const diffFocus = (oldState: ChatState, newState: ChatState): boolean => {
  if (newState.modelPickerOpen && !oldState.modelPickerOpen) {
    return false
  }
  if (!newState.focused) {
    return true
  }
  if (newState.inputSource === 'script') {
    return false
  }
  return oldState.focus === newState.focus && oldState.focused === newState.focused
}
