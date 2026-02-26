import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'

const ensureSessions = (state: StatusBarState): readonly ChatSession[] => {
  if (state.sessions.length > 0) {
    return state.sessions
  }
  const id = `session-${state.nextSessionId}`
  return [
    {
      id,
      messages: [],
      title: `Chat ${state.nextSessionId}`,
    },
  ]
}

export const loadContent = async (state: StatusBarState): Promise<StatusBarState> => {
  const sessions = ensureSessions(state)
  const selectedSessionId = sessions.some((session) => session.id === state.selectedSessionId) ? state.selectedSessionId : sessions[0].id
  return {
    ...state,
    initial: false,
    nextSessionId: state.sessions.length === 0 ? state.nextSessionId + 1 : state.nextSessionId,
    selectedSessionId,
    sessions,
  }
}
