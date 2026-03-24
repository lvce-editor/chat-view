import type { ChatState } from '../ChatState/ChatState.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const setQuestionToolEnabled = (state: ChatState, questionToolEnabled: boolean): ChatState => {
  return {
    ...state,
    questionToolEnabled,
  }
}
