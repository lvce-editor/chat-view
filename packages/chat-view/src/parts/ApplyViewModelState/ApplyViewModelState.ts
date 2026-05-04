import type { ChatState } from '../ChatState/ChatState.ts'

export const applyViewModelState = async (_state: ChatState, newState: ChatState): Promise<ChatState> => {
  return newState
}
