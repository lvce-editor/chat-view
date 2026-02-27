import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const handleInputFocus = async (state: ChatState, name: string): Promise<ChatState> => {
  if (name !== 'composer') {
    return state
  }
  return state
}
