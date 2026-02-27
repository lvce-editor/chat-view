import type { ChatState } from '../ChatState/ChatState.ts'
import * as HandleSubmit from '../HandleSubmit/HandleSubmit.ts'
import * as SubmitRename from '../SubmitRename/SubmitRename.ts'

export const handleKeyDown = async (state: ChatState, key: string, shiftKey: boolean): Promise<ChatState> => {
  const { composerValue, renamingSessionId, selectedSessionId, sessions, viewMode } = state
  if (key !== 'Enter' || shiftKey) {
    return state
  }
  if (renamingSessionId) {
    return SubmitRename.submitRename(state)
  }
  const hasInput = composerValue.trim().length > 0
  const hasSelectedSession = sessions.some((session) => session.id === selectedSessionId)
  const submitState = viewMode === 'list' && hasInput && hasSelectedSession ? { ...state, viewMode: 'detail' as const } : state
  return HandleSubmit.handleSubmit(submitState)
}
