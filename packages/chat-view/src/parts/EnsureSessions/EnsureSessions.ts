import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const ensureSessions = (state: ChatState): readonly ChatSession[] => {
  if (state.sessions.length > 0) {
    return state.sessions
  }
  return []
}
