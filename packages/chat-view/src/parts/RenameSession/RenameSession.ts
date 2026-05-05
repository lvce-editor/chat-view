import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { sanitizeGeneratedTitle } from '../SanitizeGeneratedTitle/SanitizeGeneratedTitle.ts'
import { showSessionRenameQuickInput } from '../ShowSessionRenameQuickInput/ShowSessionRenameQuickInput.ts'

export const renameSession = async (state: ChatState, sessionId: string, currentTitle: string): Promise<ChatState> => {
  const result = await showSessionRenameQuickInput(currentTitle)
  if (result.canceled) {
    return state
  }
  const nextTitle = sanitizeGeneratedTitle(result.inputValue)
  if (!nextTitle || nextTitle === currentTitle) {
    return state
  }
  const updatedSessions: readonly ChatSession[] = state.sessions.map((session) => {
    if (session.id !== sessionId) {
      return session
    }
    return {
      ...session,
      title: nextTitle,
    }
  })
  const renamedSession = updatedSessions.find((session) => session.id === sessionId)
  if (!renamedSession) {
    return state
  }
  await saveChatSession(renamedSession)
  return {
    ...state,
    sessions: updatedSessions,
  }
}