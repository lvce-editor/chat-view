import type { ChatSession, ChatState } from '../StatusBarState/StatusBarState.ts'
import * as HandleSubmit from '../HandleSubmit/HandleSubmit.ts'

const submitRename = (state: ChatState): ChatState => {
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

export const handleKeyDown = async (state: ChatState, key: string, shiftKey: boolean): Promise<ChatState> => {
  if (key !== 'Enter' || shiftKey) {
    return state
  }
  if (state.renamingSessionId) {
    return submitRename(state)
  }
  return HandleSubmit.handleSubmit(state)
}
