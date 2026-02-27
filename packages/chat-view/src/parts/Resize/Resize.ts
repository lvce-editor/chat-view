import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const resize = (state: ChatState, dimensions: any): ChatState => {
  return {
    ...state,
    ...dimensions,
  }
}
