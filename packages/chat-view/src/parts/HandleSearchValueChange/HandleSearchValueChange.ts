import type { ChatState } from '../ChatState/ChatState.ts'

export const handleSearchValueChange = (state: ChatState, newValue: string): ChatState => {
  return {
    ...state,
    searchValue: newValue,
  }
}
