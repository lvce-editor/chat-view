import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
export { handleToolCallsChunkFunction } from '../HandleToolCallsChunkFunction/HandleToolCallsChunkFunction.ts'
export { updateMessageToolCallsInSelectedSession } from '../UpdateMessageToolCallsInSelectedSession/UpdateMessageToolCallsInSelectedSession.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import { getNextHandleTextChunkState } from '../GetNextHandleTextChunkState/GetNextHandleTextChunkState.ts'
import { parseAndStoreMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'

export const updateMessageTextInSelectedSession = async (
  sessions: readonly ChatSession[],
  parsedMessages: readonly ParsedMessage[],
  selectedSessionId: string,
  messageId: string,
  text: string,
  inProgress: boolean,
): Promise<{ readonly parsedMessages: readonly ParsedMessage[]; readonly sessions: readonly ChatSession[] }> => {
  let updatedMessage: ChatSession['messages'][number] | undefined
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
        updatedMessage = {
          ...message,
          inProgress,
          text,
        }
        return updatedMessage
      }),
    }
  })
  let nextParsedMessages = parsedMessages
  if (updatedMessage) {
    nextParsedMessages = await parseAndStoreMessageContent(parsedMessages, updatedMessage)
  }
  return {
    parsedMessages: nextParsedMessages,
    sessions: updatedSessions,
  }
}

export const handleTextChunkFunction = async (
  assistantMessageId: string,
  chunk: string,
  latestState: ChatState,
): Promise<ChatState> => {
  const selectedSession = latestState.sessions.find((session) => session.id === latestState.selectedSessionId)
  if (!selectedSession) {
    return latestState
  }
  const assistantMessage = selectedSession.messages.find((message) => message.id === assistantMessageId)
  if (!assistantMessage) {
    return latestState
  }
  const updatedText = assistantMessage.text + chunk
  const updated = await updateMessageTextInSelectedSession(
    latestState.sessions,
    latestState.parsedMessages,
    latestState.selectedSessionId,
    assistantMessageId,
    updatedText,
    true,
  )
  return getNextHandleTextChunkState(latestState, updated.parsedMessages, updated.sessions)
}
