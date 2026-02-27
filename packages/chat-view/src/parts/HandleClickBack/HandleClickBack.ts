import type { ChatState } from '../ChatState/ChatState.ts'

export const handleClickBack = async (state: ChatState): Promise<ChatState> => {
  return {
    ...state,
    renamingSessionId: '',
    viewMode: 'list',
  }
}
