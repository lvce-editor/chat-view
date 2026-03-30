import type { HandleTextChunkState } from '../HandleTextChunkFunction/HandleTextChunkFunction.ts'
import { getChatSessionStatus } from '../GetChatSessionStatus/GetChatSessionStatus.ts'
import type { StreamingToolCall } from '../StreamingToolCall/StreamingToolCall.ts'
import { getMessageById } from '../GetMessageById/GetMessageById.ts'
import { getNextHandleTextChunkState } from '../GetNextHandleTextChunkState/GetNextHandleTextChunkState.ts'
import { setAndRerenderHandleTextChunkState } from '../SetAndRerenderHandleTextChunkState/SetAndRerenderHandleTextChunkState.ts'
import { get } from '../StatusBarStates/StatusBarStates.ts'
import { updateMessageToolCallsInSelectedSession } from '../UpdateMessageToolCallsInSelectedSession/UpdateMessageToolCallsInSelectedSession.ts'

export const handleToolCallsChunkFunction = async (
  uid: number,
  sessionId: string,
  assistantMessageId: string,
  toolCalls: readonly StreamingToolCall[],
  handleTextChunkState: Readonly<HandleTextChunkState>,
): Promise<HandleTextChunkState> => {
  const liveState = get(uid)?.newState || handleTextChunkState.latestState
  const selectedSession = liveState.sessions.find((session) => session.id === sessionId)
  if (!selectedSession) {
    return {
      latestState: liveState,
      previousState: liveState,
    }
  }
  if (getChatSessionStatus(selectedSession) === 'stopped') {
    return {
      latestState: liveState,
      previousState: liveState,
    }
  }
  const assistantMessage = getMessageById(selectedSession.messages, assistantMessageId)
  if (!assistantMessage) {
    return {
      latestState: liveState,
      previousState: liveState,
    }
  }
  const updated = updateMessageToolCallsInSelectedSession(
    liveState.sessions,
    liveState.parsedMessages,
    sessionId,
    assistantMessageId,
    toolCalls,
  )
  const nextState = getNextHandleTextChunkState(liveState, updated.parsedMessages, updated.sessions)
  await setAndRerenderHandleTextChunkState(uid, liveState, nextState)
  return {
    latestState: nextState,
    previousState: nextState,
  }
}
