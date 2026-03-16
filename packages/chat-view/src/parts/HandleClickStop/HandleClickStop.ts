import type { ChatState } from '../ChatState/ChatState.ts'
import * as ActiveChatRequests from '../ActiveChatRequests/ActiveChatRequests.ts'

export const handleClickStop = async (state: ChatState): Promise<ChatState> => {
  ActiveChatRequests.abort(state.uid)
  return {
    ...state,
    requestInProgress: false,
    sessions: state.sessions.map((session) => {
      if (session.id !== state.selectedSessionId) {
        return session
      }
      return {
        ...session,
        messages: session.messages.map((message) => {
          if (!message.inProgress) {
            return message
          }
          return {
            ...message,
            inProgress: false,
          }
        }),
      }
    }),
  }
}
