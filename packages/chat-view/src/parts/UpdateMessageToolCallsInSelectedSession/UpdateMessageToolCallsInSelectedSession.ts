import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'
import { mergeToolCalls } from '../MergeToolCalls/MergeToolCalls.ts'
import { copyParsedMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'

export const updateMessageToolCallsInSelectedSession = (
  messages: readonly ChatMessage[],
  parsedMessages: readonly ParsedMessage[],
  messageId: string,
  toolCalls: readonly StreamingToolCall[],
): { readonly messages: readonly ChatMessage[]; readonly parsedMessages: readonly ParsedMessage[] } => {
  let nextParsedMessages = parsedMessages
  const updatedMessages = messages.map((message) => {
    if (message.id !== messageId) {
      return message
    }
    const updatedMessage = {
      ...message,
      toolCalls: mergeToolCalls(message.toolCalls, toolCalls),
    }
    nextParsedMessages = copyParsedMessageContent(nextParsedMessages, message.id, updatedMessage.id)
    return updatedMessage
  })
  return {
    messages: updatedMessages,
    parsedMessages: nextParsedMessages,
  }
}
