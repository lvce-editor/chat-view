import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'

export const resize = (state: ChatDebugViewState, dimensions: unknown): ChatDebugViewState => {
  return {
    ...state,
    ...(dimensions as object),
  }
}
