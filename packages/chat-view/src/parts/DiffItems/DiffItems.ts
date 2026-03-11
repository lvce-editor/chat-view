import type { ChatState } from '../ChatState/ChatState.ts'

export const isEqual = (oldState: ChatState, newState: ChatState): boolean => {
  return (
    oldState.composerDropActive === newState.composerDropActive &&
    oldState.composerDropEnabled === newState.composerDropEnabled &&
    oldState.composerValue === newState.composerValue &&
    oldState.initial === newState.initial &&
    oldState.renamingSessionId === newState.renamingSessionId &&
    oldState.selectedModelId === newState.selectedModelId &&
    oldState.selectedSessionId === newState.selectedSessionId &&
    oldState.sessions === newState.sessions &&
    oldState.tokensMax === newState.tokensMax &&
    oldState.tokensUsed === newState.tokensUsed &&
    oldState.usageOverviewEnabled === newState.usageOverviewEnabled &&
    oldState.viewMode === newState.viewMode
  )
}
