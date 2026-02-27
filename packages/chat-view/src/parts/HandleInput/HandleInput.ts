import type { ChatState } from '../ChatState/ChatState.ts'

export const handleInput = async (state: ChatState, value: string, inputSource: 'user' | 'script' = 'user'): Promise<ChatState> => {
  return {
    ...state,
    composerValue: value,
    inputSource,
  }
}
