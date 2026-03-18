import type { ChatState } from '../ChatState/ChatState.ts'

export const setQuestionToolEnabled = (state: ChatState, questionToolEnabled: boolean): ChatState => {
  return {
    ...state,
    questionToolEnabled,
  }
}
