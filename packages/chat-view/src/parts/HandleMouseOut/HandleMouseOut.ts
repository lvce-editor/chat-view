import type { ChatState } from '../ChatState/ChatState.ts'
import { hideComposerAttachmentPreviewOverlay } from '../HideComposerAttachmentPreviewOverlay/HideComposerAttachmentPreviewOverlay.ts'
import * as InputName from '../InputName/InputName.ts'

const isCurrentAttachmentTarget = (name: string, attachmentId: string): boolean => {
  return (
    name === InputName.getComposerAttachmentInputName(attachmentId) ||
    (InputName.isComposerAttachmentRemoveInputName(name) && InputName.getAttachmentIdFromComposerAttachmentRemoveInputName(name) === attachmentId)
  )
}

export const handleMouseOut = async (state: ChatState, name: string, relatedName = ''): Promise<ChatState> => {
  const { composerAttachmentPreviewOverlayAttachmentId } = state
  if (!composerAttachmentPreviewOverlayAttachmentId) {
    return state
  }
  const isLeavingOverlay = InputName.isComposerAttachmentPreviewOverlayInputName(name)
  if (!isLeavingOverlay) {
    return state
  }
  if (
    InputName.isComposerAttachmentPreviewOverlayInputName(relatedName) ||
    isCurrentAttachmentTarget(relatedName, composerAttachmentPreviewOverlayAttachmentId)
  ) {
    return state
  }
  return hideComposerAttachmentPreviewOverlay(state)
}
