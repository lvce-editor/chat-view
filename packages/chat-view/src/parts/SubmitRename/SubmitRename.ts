import type { ChatSession, ChatState } from '../ChatState/ChatState.ts'

export const submitRename = (state: ChatState): ChatState => {
  const { composerValue, renamingSessionId, sessions } = state
  const title = composerValue.trim()
  if (!renamingSessionId || !title) {
    return {
      ...state,
      renamingSessionId: '',
    }
  }
  const updatedSessions: readonly ChatSession[] = sessions.map((session) => {
    if (session.id !== renamingSessionId) {
      return session
    }
    return {
      ...session,
      title,
    }
  })
  return {
    ...state,
    composerValue: '',
    inputSource: 'script',
    renamingSessionId: '',
    sessions: updatedSessions,
  }
}
