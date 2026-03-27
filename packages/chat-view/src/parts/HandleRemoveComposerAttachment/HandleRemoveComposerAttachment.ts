import type { ChatState } from '../ChatState/ChatState.ts'
import { appendChatViewEvent } from '../ChatSessionStorage/ChatSessionStorage.ts'

export const handleRemoveComposerAttachment = async (state: ChatState, attachmentId: string): Promise<ChatState> => {
  const composerAttachments = state.composerAttachments.filter((attachment) => attachment.attachmentId !== attachmentId)
  if (composerAttachments.length === state.composerAttachments.length) {
    return state
  }
  if (state.selectedSessionId) {
    await appendChatViewEvent({
      attachmentId,
      sessionId: state.selectedSessionId,
      timestamp: new Date().toISOString(),
      type: 'chat-attachment-removed',
    })
  }
  return {
    ...state,
    composerAttachments,
  }
}
