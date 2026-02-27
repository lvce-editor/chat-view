import type { ChatState } from '../ChatState/ChatState.ts'

export const diffValue = (oldState: ChatState, newState: ChatState): boolean => {
  if (oldState.composerValue === newState.composerValue) {
    return true
  }
  return newState.inputSource !== 'script'
}
