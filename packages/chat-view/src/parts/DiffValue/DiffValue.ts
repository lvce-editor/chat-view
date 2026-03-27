import type { ChatState } from '../ChatState/ChatState.ts'

export const diffValue = (oldState: ChatState, newState: ChatState): boolean => {
  return oldState.composerValue === newState.composerValue || newState.inputSource !== 'script'
}
