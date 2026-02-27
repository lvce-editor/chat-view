import type { ChatState } from '../../StatusBarState/StatusBarState.ts'
import * as HandleSubmit from '../../HandleSubmit/HandleSubmit.ts'

export const handleClickSend = async (state: ChatState): Promise<ChatState> => {
  const hasSelectedSession = state.sessions.some((session) => session.id === state.selectedSessionId)
  const submitState = state.viewMode === 'list' && hasSelectedSession ? { ...state, viewMode: 'detail' as const } : state
  return HandleSubmit.handleSubmit(submitState)
}
