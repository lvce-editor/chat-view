import type { ChatState } from '../ChatState/ChatState.ts'

 
export const setAddContextButtonEnabled = (state: ChatState, addContextButtonEnabled: boolean): ChatState => {
  return {
    ...state,
    addContextButtonEnabled,
  }
}
