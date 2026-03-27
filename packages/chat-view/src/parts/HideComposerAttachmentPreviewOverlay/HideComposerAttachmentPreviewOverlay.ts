import type { ChatState } from '../ChatState/ChatState.ts'

export const hideComposerAttachmentPreviewOverlay = async (state: ChatState): Promise<ChatState> => {
  if (!state.composerAttachmentPreviewOverlayAttachmentId && !state.composerAttachmentPreviewOverlayError) {
    return state
  }
  return {
    ...state,
    composerAttachmentPreviewOverlayAttachmentId: '',
    composerAttachmentPreviewOverlayError: false,
  }
}
