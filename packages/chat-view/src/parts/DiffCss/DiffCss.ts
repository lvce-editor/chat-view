import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const isEqual = (oldState: ChatState, newState: ChatState): boolean => {
  return oldState.initial === newState.initial
}
