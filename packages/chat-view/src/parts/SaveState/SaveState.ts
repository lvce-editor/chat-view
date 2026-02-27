import type { ChatState } from '../ChatState/ChatState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const saveState = (state: ChatState): SavedState => {
  const { composerValue, height, nextMessageId, renamingSessionId, selectedSessionId, sessions, viewMode, width, x, y } = state
  return {
    composerValue,
    height,
    nextMessageId,
    renamingSessionId,
    selectedSessionId,
    sessions,
    viewMode,
    width,
    x,
    y,
  }
}
