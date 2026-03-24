import type { ChatState } from '../ChatState/ChatState.ts'

export const diffSelection = (oldState: ChatState, newState: ChatState): boolean => {
  return oldState.composerSelectionStart === newState.composerSelectionStart && oldState.composerSelectionEnd === newState.composerSelectionEnd
}
