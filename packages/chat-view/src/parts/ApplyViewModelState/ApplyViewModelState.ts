import type { ChatState } from '../ChatState/ChatState.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export const applyViewModelState = async (state: ChatState, newState: ChatState): Promise<ChatState> => {
  set(newState.uid, state, newState)
  return newState
}
