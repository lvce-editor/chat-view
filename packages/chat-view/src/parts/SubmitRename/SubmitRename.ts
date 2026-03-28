import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import { saveChatSession } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getMinComposerHeightForState } from '../GetComposerHeight/GetComposerHeight.ts'
import { sanitizeGeneratedTitle } from '../SanitizeGeneratedTitle/SanitizeGeneratedTitle.ts'

const getSubmittedRenameState = (state: ChatState, sessions: readonly ChatSession[]): ChatState => {
  return {
    ...state,
    composerHeight: getMinComposerHeightForState(state),
    composerSelectionEnd: 0,
    composerSelectionStart: 0,
    composerValue: '',
    inputSource: 'script',
    renamingSessionId: '',
    sessions,
  }
}

export const submitRename = async (state: ChatState): Promise<ChatState> => {
  const { composerValue, renamingSessionId, sessions } = state
  const title = composerValue.trim()
  if (!renamingSessionId || !title) {
    return {
      ...state,
      renamingSessionId: '',
    }
  }
  const promptedTitle = sanitizeGeneratedTitle(await RendererWorker.invoke('Main.prompt', title))
  if (!promptedTitle) {
    return getSubmittedRenameState(state, sessions)
  }
  const updatedSessions: readonly ChatSession[] = sessions.map((session) => {
    if (session.id !== renamingSessionId) {
      return session
    }
    return {
      ...session,
      title: promptedTitle,
    }
  })
  const renamedSession = updatedSessions.find((session) => session.id === renamingSessionId)
  if (renamedSession) {
    await saveChatSession(renamedSession)
  }
  return getSubmittedRenameState(state, updatedSessions)
}
