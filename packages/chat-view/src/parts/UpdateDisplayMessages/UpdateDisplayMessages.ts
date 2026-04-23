import type { ChatState } from '../ChatState/ChatState.ts'
import { getDisplayMessages } from '../GetDisplayMessages/GetDisplayMessages.ts'

export const withUpdatedDisplayMessages = (state: ChatState): ChatState => {
  const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
  return {
    ...state,
    displayMessages: selectedSession ? getDisplayMessages(selectedSession.messages, state.parsedMessages) : [],
  }
}
