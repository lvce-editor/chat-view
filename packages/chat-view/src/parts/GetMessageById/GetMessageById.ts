import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'

export const getMessageById = (messages: readonly ChatMessage[], messageId: string): ChatMessage | undefined => {
  return messages.find((message) => message.id === messageId)
}
