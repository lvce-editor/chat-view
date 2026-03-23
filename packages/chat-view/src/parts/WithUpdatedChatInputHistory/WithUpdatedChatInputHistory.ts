import type { ChatState } from '../ChatState/ChatState.ts'

const getDeduplicatedHistory = (history: readonly string[], value: string): readonly string[] => {
  if (history.length === 0) {
    return [value]
  }
  const lastEntry = history.at(-1)
  if (lastEntry === value) {
    return history
  }
  return [...history, value]
}

export const withUpdatedChatInputHistory = (state: ChatState, value: string): ChatState => {
  if (!state.chatHistoryEnabled) {
    return {
      ...state,
      chatInputHistoryDraft: '',
      chatInputHistoryIndex: -1,
    }
  }
  return {
    ...state,
    chatInputHistory: getDeduplicatedHistory(state.chatInputHistory, value),
    chatInputHistoryDraft: '',
    chatInputHistoryIndex: -1,
  }
}
