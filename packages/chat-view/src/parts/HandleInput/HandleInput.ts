import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const handleInput = async (state: ChatState, value: string, inputSource: 'user' | 'script' = 'user'): Promise<ChatState> => {
  console.log({ value })
  return {
    ...state,
    composerValue: value,
    inputSource,
  }
}
