import type { SavedState } from '../SavedState/SavedState.ts'
import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const saveState = (state: ChatState): SavedState => {
  const { composerValue, nextMessageId, renamingSessionId, selectedSessionId, sessions, viewMode } = state
  return {
    composerValue,
    nextMessageId,
    renamingSessionId,
    selectedSessionId,
    sessions,
    viewMode,
  }
}
