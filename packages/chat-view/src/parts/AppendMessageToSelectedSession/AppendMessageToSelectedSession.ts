import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
export const appendMessageToSelectedSession = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  message: ChatMessage,
): readonly ChatSession[] => {
  return sessions.map((session) => {
    if (session.id !== selectedSessionId) {
      return session
    }
    return {
      ...session,
      messages: [...session.messages, message],
    }
  })
}
