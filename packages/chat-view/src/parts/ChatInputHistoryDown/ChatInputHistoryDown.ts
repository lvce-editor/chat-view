import type { ChatState } from '../ChatState/ChatState.ts'
import { getNextChatHistoryState } from '../GetNextChatHistoryState/GetNextChatHistoryState.ts'

 
export const chatInputHistoryDown = async (state: ChatState): Promise<ChatState> => {
  return getNextChatHistoryState(state, 'down')
}
