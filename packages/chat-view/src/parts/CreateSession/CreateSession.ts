import type { ChatSession, ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { generateSessionId } from '../GenerateSessionId/GenerateSessionId.ts'

export const createSession = async (state: ChatState): Promise<ChatState> => {
  const id = generateSessionId()
  const session: ChatSession = {
    id,
    messages: [],
    title: `Chat ${state.sessions.length + 1}`,
  }
  await saveChatSession(session)
  return {
    ...state,
    renamingSessionId: '',
    selectedSessionId: id,
    sessions: [...state.sessions, session],
  }
}
