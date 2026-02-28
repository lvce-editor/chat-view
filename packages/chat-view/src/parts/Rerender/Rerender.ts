import type { ChatState } from '../ChatState/ChatState.ts'

export const rerender = (state: ChatState): ChatState => {
  return structuredClone(state)
}
