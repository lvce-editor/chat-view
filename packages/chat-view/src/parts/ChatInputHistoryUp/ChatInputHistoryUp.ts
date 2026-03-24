import type { ChatState } from '../ChatState/ChatState.ts'
import { getNextChatHistoryState } from '../GetNextChatHistoryState/GetNextChatHistoryState.ts'

 
export const chatInputHistoryUp = async (state: ChatState): Promise<ChatState> => {
  return getNextChatHistoryState(state, 'up')
}
