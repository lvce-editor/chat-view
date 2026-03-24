import type { ChatSession } from '../ChatSession/ChatSession.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getSessionStatusClassName = (session: ChatSession): string => {
  const hasInProgressAssistantMessage = session.messages.some((message) => message.role === 'assistant' && message.inProgress)
  if (hasInProgressAssistantMessage) {
    return ClassNames.ChatListItemStatusInProgress
  }
  const hasAssistantMessage = session.messages.some((message) => message.role === 'assistant')
  if (hasAssistantMessage) {
    return ClassNames.ChatListItemStatusFinished
  }
  return ClassNames.ChatListItemStatusStopped
}
