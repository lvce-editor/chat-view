import type { ChatMessage } from '../ChatState/ChatState.ts'

export const getMessageById = (messages: readonly ChatMessage[], messageId: string): ChatMessage | undefined => {
  return messages.find((message) => message.id === messageId)
}
