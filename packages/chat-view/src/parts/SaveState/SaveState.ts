import type { ChatState } from '../ChatState/ChatState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const saveState = (state: ChatState): SavedState => {
  const {
    chatFocusSidebarWidth,
    chatListScrollTop,
    composerValue,
    lastNormalViewMode,
    maxToolCalls,
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
    systemPrompt,
    viewMode,
  } = state
  return {
    chatFocusSidebarWidth,
    chatListScrollTop,
    composerValue,
    lastNormalViewMode,
    maxToolCalls,
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
    systemPrompt,
    viewMode,
  }
}
