import type { ChatState } from '../ChatState/ChatState.ts'

export const isEqual = (oldState: ChatState, newState: ChatState): boolean => {
  return oldState.initial === newState.initial
}
