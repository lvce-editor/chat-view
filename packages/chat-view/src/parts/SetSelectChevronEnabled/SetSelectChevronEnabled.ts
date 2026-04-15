import type { ChatState } from '../ChatState/ChatState.ts'

export const setSelectChevronEnabled = (state: ChatState, selectChevronEnabled: boolean): ChatState => {
  return {
    ...state,
    selectChevronEnabled,
  }
}
