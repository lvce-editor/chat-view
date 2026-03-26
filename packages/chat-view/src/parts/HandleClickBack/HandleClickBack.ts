import type { ChatState } from '../ChatState/ChatState.ts'

export const handleClickBack = async (state: ChatState): Promise<ChatState> => {
  return {
    ...state,
    composerAttachments: [],
    lastNormalViewMode: 'list',
    renamingSessionId: '',
    viewMode: 'list',
  }
}
