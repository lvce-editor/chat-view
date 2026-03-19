import type { HandleTextChunkState } from '../HandleTextChunkFunction/HandleTextChunkFunction.ts'
import { getMessageById } from '../GetMessageById/GetMessageById.ts'
import { getNextHandleTextChunkState } from '../GetNextHandleTextChunkState/GetNextHandleTextChunkState.ts'
import { getSelectedSession } from '../GetSelectedSession/GetSelectedSession.ts'
import { setAndRerenderHandleTextChunkState } from '../SetAndRerenderHandleTextChunkState/SetAndRerenderHandleTextChunkState.ts'
import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'
import { updateMessageToolCallsInSelectedSession } from '../UpdateMessageToolCallsInSelectedSession/UpdateMessageToolCallsInSelectedSession.ts'

export const handleToolCallsChunkFunction = async (
  uid: number,
  assistantMessageId: string,
  toolCalls: readonly StreamingToolCall[],
  handleTextChunkState: Readonly<HandleTextChunkState>,
): Promise<HandleTextChunkState> => {
  const selectedSession = getSelectedSession(handleTextChunkState.latestState.sessions, handleTextChunkState.latestState.selectedSessionId)
  if (!selectedSession) {
    return {
      latestState: handleTextChunkState.latestState,
      previousState: handleTextChunkState.previousState,
    }
  }
  const assistantMessage = getMessageById(selectedSession.messages, assistantMessageId)
  if (!assistantMessage) {
    return {
      latestState: handleTextChunkState.latestState,
      previousState: handleTextChunkState.previousState,
    }
  }
  const updated = updateMessageToolCallsInSelectedSession(
    handleTextChunkState.latestState.sessions,
    handleTextChunkState.latestState.parsedMessages,
    handleTextChunkState.latestState.selectedSessionId,
    assistantMessageId,
    toolCalls,
  )
  const nextState = getNextHandleTextChunkState(handleTextChunkState.latestState, updated.parsedMessages, updated.sessions)
  await setAndRerenderHandleTextChunkState(uid, handleTextChunkState.previousState, nextState)
  return {
    latestState: nextState,
    previousState: nextState,
  }
}
