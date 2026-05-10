import type { ChatState } from '../ChatState/ChatState.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export const applyViewModelState = async (state: ChatState, newState: ChatState): Promise<ChatState> => {
  console.log({ newState, t: typeof newState })
  set(newState.uid, state, newState)
  return newState
}
