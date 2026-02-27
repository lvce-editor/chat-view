import type { ChatState } from '../../ChatState/ChatState.ts'

export const startRename = (state: ChatState, id: string): ChatState => {
  const session = state.sessions.find((item) => item.id === id)
  if (!session) {
    return state
  }
  return {
    ...state,
    composerValue: session.title,
    inputSource: 'script',
    renamingSessionId: id,
    selectedSessionId: id,
  }
}
