import type { ChatState } from '../ChatState/ChatState.ts'
import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'
import { getMessageById } from '../GetMessageById/GetMessageById.ts'
import { getNextHandleTextChunkState } from '../GetNextHandleTextChunkState/GetNextHandleTextChunkState.ts'
import { getSelectedSession } from '../GetSelectedSession/GetSelectedSession.ts'
import { updateMessageToolCallsInSelectedSession } from '../UpdateMessageToolCallsInSelectedSession/UpdateMessageToolCallsInSelectedSession.ts'

export const handleToolCallsChunkFunction = async (
  assistantMessageId: string,
  toolCalls: readonly StreamingToolCall[],
  latestState: ChatState,
): Promise<ChatState> => {
  const selectedSession = getSelectedSession(latestState.sessions, latestState.selectedSessionId)
  if (!selectedSession) {
    return latestState
  }
  const assistantMessage = getMessageById(selectedSession.messages, assistantMessageId)
  if (!assistantMessage) {
    return latestState
  }
  const updated = updateMessageToolCallsInSelectedSession(
    latestState.sessions,
    latestState.parsedMessages,
    latestState.selectedSessionId,
    assistantMessageId,
    toolCalls,
  )
  return getNextHandleTextChunkState(latestState, updated.parsedMessages, updated.sessions)
}
