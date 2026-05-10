import type { ChatState } from '../ChatState/ChatState.ts'

export const diffSelection = (oldState: ChatState, newState: ChatState): boolean => {
  if (newState.inputSource === 'user') {
    return true
  }
  return oldState.composerSelectionStart === newState.composerSelectionStart && oldState.composerSelectionEnd === newState.composerSelectionEnd
}
