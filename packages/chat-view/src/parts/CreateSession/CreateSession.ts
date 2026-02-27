import type { ChatSession, ChatState } from '../../ChatState/ChatState.ts'
import { generateSessionId } from '../GenerateSessionId/GenerateSessionId.ts'

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
