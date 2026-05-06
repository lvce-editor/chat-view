import type { ChatState } from '../ChatState/ChatState.ts'
import { getMinComposerHeightForState } from '../GetComposerHeight/GetComposerHeight.ts'
import { renameSession } from '../RenameSession/RenameSession.ts'

const getSubmittedRenameState = (state: ChatState): ChatState => {
  return {
    ...state,
    composerHeight: getMinComposerHeightForState(state),
    composerSelectionEnd: 0,
    composerSelectionStart: 0,
    composerValue: '',
    inputSource: 'script',
    renamingSessionId: '',
    sessions: state.sessions,
  }
}

export const submitRename = async (state: ChatState): Promise<ChatState> => {
  const { composerValue, renamingSessionId } = state
  const title = composerValue.trim()
  if (!renamingSessionId || !title) {
    return {
      ...state,
      renamingSessionId: '',
    }
  }
  const renamedState = await renameSession(state, renamingSessionId, title)
  return getSubmittedRenameState(renamedState)
}
