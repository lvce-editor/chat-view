import type { ChatState } from '../../StatusBarState/StatusBarState.ts'

export const startRename = (state: ChatState, id: string): ChatState => {
  const session = state.sessions.find((item) => item.id === id)
  if (!session) {
    return state
  }
  return {
    ...state,
    composerValue: session.title,
    renamingSessionId: id,
    selectedSessionId: id,
  }
}
