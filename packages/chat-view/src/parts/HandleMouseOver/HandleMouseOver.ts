import type { ChatState } from '../ChatState/ChatState.ts'
import * as InputName from '../InputName/InputName.ts'
import { showComposerAttachmentPreviewOverlay } from '../ShowComposerAttachmentPreviewOverlay/ShowComposerAttachmentPreviewOverlay.ts'

export const handleMouseOver = async (state: ChatState, name: string): Promise<ChatState> => {
  if (!InputName.isComposerAttachmentInputName(name)) {
    return state
  }
  const attachmentId = InputName.getAttachmentIdFromComposerAttachmentInputName(name)
  return showComposerAttachmentPreviewOverlay(state, attachmentId)
}
