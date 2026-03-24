import type { ChatState } from '../ChatState/ChatState.ts'

 
export const setEmitStreamingFunctionCallEvents = (state: ChatState, emitStreamingFunctionCallEvents: boolean): ChatState => {
  return {
    ...state,
    emitStreamingFunctionCallEvents,
  }
}
