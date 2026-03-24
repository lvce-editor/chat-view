import type { ChatState } from '../ChatState/ChatState.ts'

export const getSystemPrompt = (state: ChatState): string => {
  return state.systemPrompt
}
