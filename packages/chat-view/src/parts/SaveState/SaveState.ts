import type { ChatState } from '../ChatState/ChatState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const saveState = (state: ChatState): SavedState => {
  const { chatListScrollTop, composerValue, messagesScrollTop, nextMessageId, renamingSessionId, selectedModelId, selectedSessionId, viewMode } =
    state
  return {
    chatListScrollTop,
    composerValue,
    messagesScrollTop,
    nextMessageId,
    renamingSessionId,
    selectedModelId,
    selectedSessionId,
    viewMode,
  }
}
