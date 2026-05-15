import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'

export const getChatSessionStatus = (session: ChatSession, messages: readonly ChatMessage[] = session.messages): NonNullable<ChatSession['status']> => {
  if (session.status) {
    return session.status
  }
  const hasInProgressAssistantMessage = messages.some((message) => message.role === 'assistant' && message.inProgress)
  if (hasInProgressAssistantMessage) {
    return 'in-progress'
  }
  const hasAssistantMessage = messages.some((message) => message.role === 'assistant')
  if (hasAssistantMessage) {
    return 'finished'
  }
  return 'idle'
}
