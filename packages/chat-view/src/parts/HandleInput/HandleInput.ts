import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const handleInput = async (state: ChatState, value: string, inputSource: 'user' | 'script' = 'user'): Promise<ChatState> => {
  console.log({ inputSource, value })
  if (state.ignoreNextInput) {
    return {
      ...state,
      ignoreNextInput: false,
    }
  }
  return {
    ...state,
    composerValue: value,
    inputSource,
  }
}
