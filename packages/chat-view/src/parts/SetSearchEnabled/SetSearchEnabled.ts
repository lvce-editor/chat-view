import type { ChatState } from '../ChatState/ChatState.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const setSearchEnabled = (state: ChatState, searchEnabled: boolean): ChatState => {
  return {
    ...state,
    searchEnabled,
    searchFieldVisible: searchEnabled ? state.searchFieldVisible : false,
    searchValue: searchEnabled ? state.searchValue : '',
  }
}
