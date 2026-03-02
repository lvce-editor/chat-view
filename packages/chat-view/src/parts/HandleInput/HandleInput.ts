import type { ChatState } from '../ChatState/ChatState.ts'
import { OpenRouterApiKeyInput } from '../OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'

const COMPOSER = 'composer'

export const handleInput = async (state: ChatState, name: string, value: string, inputSource: 'user' | 'script' = 'user'): Promise<ChatState> => {
  if (name === OpenRouterApiKeyInput) {
    return {
      ...state,
      openRouterApiKeyInput: value,
    }
  }
  if (name !== COMPOSER) {
    return state
  }
  return {
    ...state,
    composerValue: value,
    inputSource,
  }
}
