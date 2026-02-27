import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const handleInput = async (state: ChatState, value: string): Promise<ChatState> => {
  if (state.ignoreNextInput) {
    return {
      ...state,
      ignoreNextInput: false,
    }
  }
  return {
    ...state,
    composerValue: value,
  }
}
