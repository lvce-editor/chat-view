import type { ChatState } from '../ChatState/ChatState.ts'
import { getChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachments } from '../GetComposerAttachments/GetComposerAttachments.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const selectProject = async (state: ChatState, projectId: string): Promise<ChatState> => {
  if (!projectId || state.selectedProjectId === projectId) {
    return state
  }
  const visibleSessions = getVisibleSessions(state.sessions, projectId)
  if (visibleSessions.length === 0) {
    return {
      ...state,
      composerAttachments: [],
      selectedProjectId: projectId,
      selectedSessionId: '',
      viewMode: state.viewMode === 'chat-focus' ? 'chat-focus' : 'list',
    }
  }
  const currentSessionVisible = visibleSessions.some((session) => session.id === state.selectedSessionId)
  const nextSelectedSessionId = currentSessionVisible ? state.selectedSessionId : visibleSessions[0].id
  const loadedSession = await getChatSession(nextSelectedSessionId)
  const composerAttachments = await getComposerAttachments(nextSelectedSessionId)
  const sessions = state.sessions.map((session) => {
    if (session.id !== nextSelectedSessionId || !loadedSession) {
      return session
    }
    return loadedSession
  })
  return {
    ...state,
    composerAttachments,
    selectedProjectId: projectId,
    selectedSessionId: nextSelectedSessionId,
    sessions,
    viewMode: state.viewMode === 'chat-focus' ? 'chat-focus' : 'detail',
  }
}
