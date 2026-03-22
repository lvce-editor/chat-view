import type { ChatState } from '../ChatState/ChatState.ts'

export const diffFocus = (oldState: ChatState, newState: ChatState): boolean => {
  if (newState.newChatModelPickerEnabled && newState.modelPickerOpen && !oldState.modelPickerOpen) {
    return false
  }
  if (!newState.focused) {
    return true
  }
  return oldState.focus === newState.focus && oldState.focused === newState.focused
}
