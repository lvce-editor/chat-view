import type { ChatState } from '../ChatState/ChatState.ts'

export const rerender = (state: ChatState): ChatState => {
  console.log({ state })
  return structuredClone(state)
}
