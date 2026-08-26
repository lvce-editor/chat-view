import type { ChatState } from '../ChatState/ChatState.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import { getNextAutoScrollTop } from '../GetNextAutoScrollTop/GetNextAutoScrollTop.ts'

export const getNextHandleTextChunkState = (
  latestState: ChatState,
  messages: ChatState['messages'],
  parsedMessages: readonly ParsedMessage[],
  sessions: ChatState['sessions'],
): ChatState => {
  return {
    ...latestState,
    messages,
    ...(latestState.messagesAutoScrollEnabled && {
      messagesScrollTop: getNextAutoScrollTop(latestState.messagesScrollTop),
    }),
    parsedMessages,
    sessions,
  }
}
