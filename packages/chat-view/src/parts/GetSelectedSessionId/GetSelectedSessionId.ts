import type { ChatState } from '../ChatState/ChatState.ts'

export const getSelectedSessionId = (state: ChatState): string => {
  console.log({ id: state.selectedSessionId })
  return state.selectedSessionId
}
