import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const ensureSessions = (state: ChatState): readonly ChatSession[] => {
  if (state.sessions.length > 0) {
    return state.sessions
  }
<<<<<<< HEAD
  return []
=======
  const id = generateSessionId()
  return [
    {
      id,
      messages: [],
      title: 'Chat 1',
    },
  ]
>>>>>>> origin/main
}
