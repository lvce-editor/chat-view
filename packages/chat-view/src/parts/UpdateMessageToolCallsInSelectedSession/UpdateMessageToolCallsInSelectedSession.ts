import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'
import { mergeToolCalls } from '../MergeToolCalls/MergeToolCalls.ts'
import { copyParsedMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'

const isSessionArray = (value: readonly ChatMessage[] | readonly ChatSession[]): value is readonly ChatSession[] => {
  return value.length > 0 && 'messages' in value[0]
}

export const updateMessageToolCallsInSelectedSession = (
  messagesOrSessions: readonly ChatMessage[] | readonly ChatSession[],
  parsedMessages: readonly ParsedMessage[],
  selectedSessionIdOrMessageId: string,
  messageIdOrToolCalls: string | readonly StreamingToolCall[],
  toolCallsArg?: readonly StreamingToolCall[],
): {
  readonly messages: readonly ChatMessage[]
  readonly parsedMessages: readonly ParsedMessage[]
  readonly sessions?: readonly ChatSession[]
} => {
  const legacyMode = isSessionArray(messagesOrSessions)
  const selectedSessionId = legacyMode ? selectedSessionIdOrMessageId : ''
  const messageId = legacyMode ? (messageIdOrToolCalls as string) : selectedSessionIdOrMessageId
  const toolCalls = legacyMode ? toolCallsArg || [] : (messageIdOrToolCalls as readonly StreamingToolCall[])
  const messages = legacyMode ? messagesOrSessions.find((session) => session.id === selectedSessionId)?.messages || [] : messagesOrSessions
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
  if (legacyMode) {
    return {
      messages: updatedMessages,
      parsedMessages: nextParsedMessages,
      sessions: messagesOrSessions.map((session) => {
        if (session.id !== selectedSessionId) {
          return session
        }
        return {
          ...session,
          messages: updatedMessages,
        }
      }),
    }
  }
  return {
    messages: updatedMessages,
    parsedMessages: nextParsedMessages,
  }
}
