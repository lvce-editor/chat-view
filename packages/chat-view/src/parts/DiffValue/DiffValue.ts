import type { ChatState } from '../ChatState/ChatState.ts'

export const diffValue = (oldState: ChatState, newState: ChatState): boolean => {
  if (oldState.openApiApiKeyInput !== newState.openApiApiKeyInput) {
    return false
  }
  if (oldState.openRouterApiKeyInput !== newState.openRouterApiKeyInput) {
    return false
  }
  return oldState.composerValue === newState.composerValue || newState.inputSource !== 'script'
}
