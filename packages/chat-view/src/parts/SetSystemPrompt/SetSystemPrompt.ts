import type { ChatState } from '../ChatState/ChatState.ts'

export const setSystemPrompt = (state: ChatState, systemPrompt: string): ChatState => {
  return {
    ...state,
    systemPrompt,
  }
}
