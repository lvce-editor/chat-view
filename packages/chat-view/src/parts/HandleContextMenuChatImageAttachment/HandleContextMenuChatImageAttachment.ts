import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { MenuChatAttachment } from '../GetMenuEntryIds/GetMenuEntryIds.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleContextMenuChatImageAttachment = async (state: ChatState, name: string, eventX: number, eventY: number): Promise<ChatState> => {
  const getFallbackAttachment = () => {
    const attachmentsWithPreview = state.composerAttachments.filter((attachment) => attachment.previewSrc)
    if (attachmentsWithPreview.length !== 1) {
      return undefined
    }
    return attachmentsWithPreview[0]
  }

  const attachment = InputName.isComposerAttachmentPreviewInputName(name)
    ? state.composerAttachments.find((item) => item.attachmentId === InputName.getAttachmentIdFromComposerAttachmentPreviewInputName(name))
    : getFallbackAttachment()

  if (!attachment?.previewSrc) {
    return state
  }
  await RendererWorker.showContextMenu2(state.uid, MenuChatAttachment, eventX, eventY, {
    attachmentId: attachment.attachmentId,
    menuId: MenuChatAttachment,
    previewSrc: attachment.previewSrc,
  })
  return state
}
