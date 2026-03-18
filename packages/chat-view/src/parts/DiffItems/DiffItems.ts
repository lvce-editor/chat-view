import type { ChatState } from '../ChatState/ChatState.ts'

const isEqualProjectExpandedIds = (a: readonly string[], b: readonly string[]): boolean => {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

const isEqualQueuedMessages = (a: ChatState['queuedMessages'], b: ChatState['queuedMessages']): boolean => {
  if (a === b) {
    return true
  }
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

export const isEqual = (oldState: ChatState, newState: ChatState): boolean => {
  return (
    oldState.authEnabled === newState.authEnabled &&
    oldState.authErrorMessage === newState.authErrorMessage &&
    oldState.authStatus === newState.authStatus &&
    oldState.composerDropActive === newState.composerDropActive &&
    oldState.composerDropEnabled === newState.composerDropEnabled &&
    oldState.composerValue === newState.composerValue &&
    oldState.initial === newState.initial &&
    isEqualProjectExpandedIds(oldState.projectExpandedIds, newState.projectExpandedIds) &&
    oldState.projectListScrollTop === newState.projectListScrollTop &&
    isEqualQueuedMessages(oldState.queuedMessages, newState.queuedMessages) &&
    oldState.renamingSessionId === newState.renamingSessionId &&
    oldState.selectedModelId === newState.selectedModelId &&
    oldState.selectedProjectId === newState.selectedProjectId &&
    oldState.selectedSessionId === newState.selectedSessionId &&
    oldState.sessions === newState.sessions &&
    oldState.tokensMax === newState.tokensMax &&
    oldState.tokensUsed === newState.tokensUsed &&
    oldState.usageOverviewEnabled === newState.usageOverviewEnabled &&
    oldState.useChatMathWorker === newState.useChatMathWorker &&
    oldState.viewMode === newState.viewMode &&
    oldState.voiceDictationEnabled === newState.voiceDictationEnabled
  )
}
