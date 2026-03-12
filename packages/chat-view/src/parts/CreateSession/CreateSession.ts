import type { ChatSession, ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { generateSessionId } from '../GenerateSessionId/GenerateSessionId.ts'

export const createSession = async (state: ChatState): Promise<ChatState> => {
  const id = generateSessionId()
  const fallbackProjectId = state.projects.find((project) => project.name === '_blank')?.id || state.projects[0]?.id || 'project-1'
  const projectId = state.selectedProjectId || fallbackProjectId
  const session: ChatSession = {
    id,
    messages: [],
    projectId,
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
