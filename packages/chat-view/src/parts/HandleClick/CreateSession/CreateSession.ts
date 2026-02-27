import { generateSessionId } from '../../GenerateSessionId/GenerateSessionId.ts'
import type { ChatSession, ChatState } from '../../StatusBarState/StatusBarState.ts'

export const createSession = (state: ChatState): ChatState => {
  const id = generateSessionId()
  const session: ChatSession = {
    id,
    messages: [],
    title: `Chat ${state.sessions.length + 1}`,
  }
  return {
    ...state,
    renamingSessionId: '',
    selectedSessionId: id,
    sessions: [...state.sessions, session],
  }
}
