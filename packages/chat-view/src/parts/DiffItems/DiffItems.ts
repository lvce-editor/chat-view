import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const isEqual = (oldState: ChatState, newState: ChatState): boolean => {
  return (
    oldState.ignoreNextInput === newState.ignoreNextInput &&
    oldState.initial === newState.initial &&
    oldState.renamingSessionId === newState.renamingSessionId &&
    oldState.selectedSessionId === newState.selectedSessionId &&
    oldState.sessions === newState.sessions &&
    oldState.viewMode === newState.viewMode
  )
}
