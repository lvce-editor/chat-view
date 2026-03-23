import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getMinComposerHeightForState } from '../GetComposerHeight/GetComposerHeight.ts'

export const submitRename = async (state: ChatState): Promise<ChatState> => {
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
  const renamedSession = updatedSessions.find((session) => session.id === renamingSessionId)
  if (renamedSession) {
    await saveChatSession(renamedSession)
  }
  return {
    ...state,
    composerHeight: getMinComposerHeightForState(state),
    composerValue: '',
    inputSource: 'script',
    renamingSessionId: '',
    sessions: updatedSessions,
  }
}
