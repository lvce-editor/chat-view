import type { ChatState } from '../StatusBarState/StatusBarState.ts'

export const handleClickBack = async (state: ChatState): Promise<ChatState> => {
  return {
    ...state,
    renamingSessionId: '',
    viewMode: 'list',
  }
}
