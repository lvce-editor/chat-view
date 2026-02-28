import type { ChatState } from '../ChatState/ChatState.ts'

export const selectSession = (state: ChatState, id: string): ChatState => {
  const exists = state.sessions.some((session) => session.id === id)
  if (!exists) {
    return state
  }
  return {
    ...state,
    renamingSessionId: '',
    selectedSessionId: id,
    viewMode: 'detail',
  }
}
