import type { ChatState } from '../ChatState/ChatState.ts'
import * as HandleSubmit from '../HandleSubmit/HandleSubmit.ts'

export const handleClickSend = async (state: ChatState): Promise<ChatState> => {
  const { selectedSessionId, sessions, viewMode } = state
  const hasSelectedSession = sessions.some((session) => session.id === selectedSessionId)
  const submitState = viewMode === 'list' && hasSelectedSession ? { ...state, viewMode: 'detail' as const } : state
  return HandleSubmit.handleSubmit(submitState)
}
