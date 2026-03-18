import type { ChatState } from '../ChatState/ChatState.ts'

export const setBackendUrl = (state: ChatState, backendUrl: string): ChatState => {
  return {
    ...state,
    backendUrl,
  }
}
