import type { ChatState } from '../ChatState/ChatState.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'
import { selectSession } from '../SelectSession/SelectSession.ts'

export const selectListIndex = async (state: ChatState, index: number): Promise<ChatState> => {
  const visibleSessions = getVisibleSessions(state.sessions, state.selectedProjectId)
  if (index < 0 || index >= visibleSessions.length) {
    return state
  }
  const session = visibleSessions[index]
  const nextState = await selectSession(state, session.id)
  return {
    ...nextState,
    focus: 'list',
    focused: true,
    listFocusedIndex: index,
  }
}
