import type { ChatSession } from '../ChatState/ChatState.ts'
import { copyParsedMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import { mergeToolCalls } from '../MergeToolCalls/MergeToolCalls.ts'
import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'

export const updateMessageToolCallsInSelectedSession = (
  sessions: readonly ChatSession[],
  parsedMessages: readonly ParsedMessage[],
  selectedSessionId: string,
  messageId: string,
  toolCalls: readonly StreamingToolCall[],
): { readonly parsedMessages: readonly ParsedMessage[]; readonly sessions: readonly ChatSession[] } => {
  let nextParsedMessages = parsedMessages
  const updatedSessions = sessions.map((session) => {
    if (session.id !== selectedSessionId) {
      return session
    }
    return {
      ...session,
      messages: session.messages.map((message) => {
        if (message.id !== messageId) {
          return message
        }
        const updatedMessage = {
          ...message,
          toolCalls: mergeToolCalls(message.toolCalls, toolCalls),
        }
        nextParsedMessages = copyParsedMessageContent(nextParsedMessages, message.id, updatedMessage.id)
        return updatedMessage
      }),
    }
  })
  return {
    parsedMessages: nextParsedMessages,
    sessions: updatedSessions,
  }
}
