import type { ChatState } from '../ChatState/ChatState.ts'

export const isEqual = (oldState: ChatState, newState: ChatState): boolean => {
  return (
    oldState.composerValue === newState.composerValue &&
    oldState.initial === newState.initial &&
    oldState.renamingSessionId === newState.renamingSessionId &&
    oldState.selectedModelId === newState.selectedModelId &&
    oldState.selectedSessionId === newState.selectedSessionId &&
    oldState.sessions === newState.sessions &&
    oldState.viewMode === newState.viewMode
  )
}
