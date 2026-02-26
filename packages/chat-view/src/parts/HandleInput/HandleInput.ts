import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const handleInput = async (state: StatusBarState, value: string): Promise<StatusBarState> => {
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
