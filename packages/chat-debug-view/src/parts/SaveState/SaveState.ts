import type { SavedState } from '../SavedState/SavedState.ts'
import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'

export const saveState = (state: ChatDebugViewState): SavedState => {
  const { filterValue, height, sessionId, showEventStreamFinishedEvents, showInputEvents, showResponsePartEvents, width, x, y } = state
  return {
    filterValue,
    height,
    sessionId,
    showEventStreamFinishedEvents,
    showInputEvents,
    showResponsePartEvents,
    width,
    x,
    y,
  }
}
