import type { ChatState } from '../ChatState/ChatState.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
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
