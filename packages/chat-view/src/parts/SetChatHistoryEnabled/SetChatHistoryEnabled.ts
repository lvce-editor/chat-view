import type { ChatState } from '../ChatState/ChatState.ts'

 
export const setChatHistoryEnabled = (state: ChatState, chatHistoryEnabled: boolean): ChatState => {
  return {
    ...state,
    chatHistoryEnabled,
    ...(chatHistoryEnabled
      ? {}
      : {
          chatInputHistoryDraft: '',
          chatInputHistoryIndex: -1,
        }),
  }
}
