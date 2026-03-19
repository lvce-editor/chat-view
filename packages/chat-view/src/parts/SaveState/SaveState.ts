import type { ChatState } from '../ChatState/ChatState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const saveState = (state: ChatState): SavedState => {
  const {
    chatListScrollTop,
    composerValue,
    lastNormalViewMode,
    messagesScrollTop,
    nextMessageId,
    projectExpandedIds,
    projectListScrollTop,
    projects,
    renamingSessionId,
    searchFieldVisible,
    searchValue,
    selectedModelId,
    selectedProjectId,
    selectedSessionId,
    viewMode,
  } = state
  return {
    chatListScrollTop,
    composerValue,
    lastNormalViewMode,
    messagesScrollTop,
    nextMessageId,
    projectExpandedIds,
    projectListScrollTop,
    projects,
    renamingSessionId,
    searchFieldVisible,
    searchValue,
    selectedModelId,
    selectedProjectId,
    selectedSessionId,
    viewMode,
  }
}
