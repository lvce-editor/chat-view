import type { ChatState } from '../ChatState/ChatState.ts'

const COMPOSER = 'composer'
const OPEN_ROUTER_API_KEY = 'open-router-api-key'

export const handleInput = async (state: ChatState, name: string, value: string, inputSource: 'user' | 'script' = 'user'): Promise<ChatState> => {
  if (name === OPEN_ROUTER_API_KEY) {
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
