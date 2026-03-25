import type { ChatState } from '../ChatState/ChatState.ts'

 
export const setStreamingEnabled = (state: ChatState, streamingEnabled: boolean): ChatState => {
  return {
    ...state,
    streamingEnabled,
  }
}
