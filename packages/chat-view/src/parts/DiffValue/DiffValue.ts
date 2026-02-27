import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const diffValue = (oldState: ChatState, newState: ChatState): boolean => {
  return oldState.composerValue === newState.composerValue
}
