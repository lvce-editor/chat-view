import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const diffValue = (oldState: ChatState, newState: ChatState): boolean => {
  if (oldState.composerValue === newState.composerValue) {
    return true
  }
  return newState.inputSource !== 'script'
}
