import type { ChatState } from '../ChatState/ChatState.ts'
import { deleteSession } from '../DeleteSession/DeleteSession.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

export const deleteSessionAtIndex = async (state: ChatState, index: number): Promise<ChatState> => {
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId, state.sessionPinningEnabled)
  const session = visibleSessions[index]
  if (!session) {
    return state
  }
  return deleteSession(state, session.id)
}
