import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'
import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'

export const setEvents = (state: ChatDebugViewState, events: readonly ChatViewEvent[]): ChatDebugViewState => {
  return {
    ...state,
    errorMessage: '',
    events,
    initial: false,
  }
}