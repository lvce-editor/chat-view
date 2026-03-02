import type { ChatState } from '../ChatState/ChatState.ts'

export const getSelectedSessionId = (state: ChatState): string => {
  return state.selectedSessionId
}
