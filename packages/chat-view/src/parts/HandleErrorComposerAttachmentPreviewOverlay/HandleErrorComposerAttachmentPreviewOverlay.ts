import type { ChatState } from '../ChatState/ChatState.ts'

export const handleErrorComposerAttachmentPreviewOverlay = async (state: ChatState): Promise<ChatState> => {
  if (!state.composerAttachmentPreviewOverlayAttachmentId || state.composerAttachmentPreviewOverlayError) {
    return state
  }
  return {
    ...state,
    composerAttachmentPreviewOverlayError: true,
  }
}
