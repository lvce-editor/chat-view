import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'

export const rerender = (state: ChatDebugViewState): ChatDebugViewState => {
  return structuredClone(state)
}
