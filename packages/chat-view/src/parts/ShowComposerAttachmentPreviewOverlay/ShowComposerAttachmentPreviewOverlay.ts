import type { ChatState } from '../ChatState/ChatState.ts'

export const showComposerAttachmentPreviewOverlay = async (state: ChatState, attachmentId: string): Promise<ChatState> => {
  const attachment =
    state.composerAttachments.find((item) => item.attachmentId === attachmentId) ??
    state.composerAttachments.find((item) => item.displayType === 'image' && !!item.previewSrc)
  if (!attachment || attachment.displayType !== 'image' || !attachment.previewSrc) {
    return state
  }
  if (state.composerAttachmentPreviewOverlayAttachmentId === attachmentId && !state.composerAttachmentPreviewOverlayError) {
    return state
  }
  return {
    ...state,
    composerAttachmentPreviewOverlayAttachmentId: attachmentId,
    composerAttachmentPreviewOverlayError: false,
  }
}
