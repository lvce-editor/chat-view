import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export interface Renderer {
  (oldState: ChatState, newState: ChatState): readonly any[]
}
