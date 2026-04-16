import type { ChatSession } from '../ChatSession/ChatSession.ts'

const normalizeSessionOnLoad = (session: ChatSession): ChatSession => {
  if (session.status !== 'in-progress') {
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
    status: 'stopped',
  }
}

export const normalizeSessionsOnLoad = (sessions: readonly ChatSession[]): readonly ChatSession[] => {
  return sessions.map(normalizeSessionOnLoad)
}
