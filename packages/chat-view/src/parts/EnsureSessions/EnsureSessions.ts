import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import type { ChatState } from '../StatusBarState/StatusBarState.ts'
import { generateSessionId } from '../GenerateSessionId/GenerateSessionId.ts'

export const ensureSessions = (state: ChatState): readonly ChatSession[] => {
  if (state.sessions.length > 0) {
    return state.sessions
  }
  const id = generateSessionId()
  return [
    {
      id,
      messages: [],
      title: `Chat ${state.nextSessionId}`,
    },
  ]
}
