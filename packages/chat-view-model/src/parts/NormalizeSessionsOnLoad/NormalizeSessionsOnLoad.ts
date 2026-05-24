import type { ChatSession } from '../ViewModel/ViewModel.ts'
import { getObjectProperty } from '../GetObjectProperty/GetObjectProperty.ts'
import { isObject } from '../IsObject/IsObject.ts'

const normalizeSessionOnLoad = (session: ChatSession): ChatSession => {
  if (session.status !== 'in-progress') {
    return session
  }
  return {
    ...session,
    messages: session.messages.map((message) => {
      if (!isObject(message) || getObjectProperty(message, 'inProgress') !== true) {
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
