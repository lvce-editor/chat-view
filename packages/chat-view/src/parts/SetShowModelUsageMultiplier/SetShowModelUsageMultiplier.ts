import type { ChatState } from '../ChatState/ChatState.ts'

export const setShowModelUsageMultiplier = (state: ChatState, showModelUsageMultiplier: boolean): ChatState => {
  return {
    ...state,
    showModelUsageMultiplier,
  }
}
