import type { ChatState } from '../ChatState/ChatState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const saveState = (state: ChatState): SavedState => {
  const {
    chatListScrollTop,
    composerValue,
    height,
    messagesScrollTop,
    nextMessageId,
    renamingSessionId,
    selectedModelId,
    selectedSessionId,
    viewMode,
    width,
    x,
    y,
  } = state
  return {
    chatListScrollTop,
    composerValue,
    height,
    messagesScrollTop,
    nextMessageId,
    renamingSessionId,
    selectedModelId,
    selectedSessionId,
    viewMode,
    width,
    x,
    y,
  }
}
