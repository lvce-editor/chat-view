import type { SavedState } from '../SavedState/SavedState.ts'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const saveState = (state: StatusBarState): SavedState => {
  const { composerValue, nextMessageId, nextSessionId, renamingSessionId, selectedSessionId, sessions } = state
  return {
    composerValue,
    nextMessageId,
    nextSessionId,
    renamingSessionId,
    selectedSessionId,
    sessions,
  }
}
