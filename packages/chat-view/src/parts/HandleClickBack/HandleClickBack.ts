import type { ChatState } from '../ChatState/ChatState.ts'

export const handleClickBack = async (state: ChatState): Promise<ChatState> => {
  return {
    ...state,
    composerAttachments: [],
    composerAttachmentsHeight: 0,
    lastNormalViewMode: 'list',
    renamingSessionId: '',
    viewMode: 'list',
  }
}
