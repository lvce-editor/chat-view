import type { ChatState } from '../ChatState/ChatState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const saveState = (state: ChatState): SavedState => {
  const { composerValue, height, nextMessageId, renamingSessionId, selectedModelId, selectedSessionId, sessions, viewMode, width, x, y } = state
  return {
    composerValue,
    height,
    nextMessageId,
    renamingSessionId,
    selectedModelId,
    selectedSessionId,
    sessions,
    viewMode,
    width,
    x,
    y,
  }
}
