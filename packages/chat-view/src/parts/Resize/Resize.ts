import type { ChatState } from '../ChatState/ChatState.ts'

export const resize = (state: ChatState, dimensions: any): ChatState => {
  return {
    ...state,
    ...dimensions,
  }
}
