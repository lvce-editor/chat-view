import type { ChatState } from '../ChatState/ChatState.ts'

export interface Renderer {
  (oldState: ChatState, newState: ChatState): readonly any[]
}
