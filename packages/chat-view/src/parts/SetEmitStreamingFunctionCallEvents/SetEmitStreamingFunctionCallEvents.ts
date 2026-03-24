import type { ChatState } from '../ChatState/ChatState.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const setEmitStreamingFunctionCallEvents = (state: ChatState, emitStreamingFunctionCallEvents: boolean): ChatState => {
  return {
    ...state,
    emitStreamingFunctionCallEvents,
  }
}
