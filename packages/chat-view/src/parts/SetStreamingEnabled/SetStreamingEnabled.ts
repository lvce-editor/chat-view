import type { ChatState } from '../ChatState/ChatState.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const setStreamingEnabled = (state: ChatState, streamingEnabled: boolean): ChatState => {
  return {
    ...state,
    streamingEnabled,
  }
}
