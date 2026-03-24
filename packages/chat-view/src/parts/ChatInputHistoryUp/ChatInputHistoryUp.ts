import type { ChatState } from '../ChatState/ChatState.ts'
import { getNextChatHistoryState } from '../GetNextChatHistoryState/GetNextChatHistoryState.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const chatInputHistoryUp = async (state: ChatState): Promise<ChatState> => {
  return getNextChatHistoryState(state, 'up')
}
