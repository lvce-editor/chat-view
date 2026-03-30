import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ComposerAttachment } from '../../ComposerAttachment/ComposerAttachment.ts'
import * as ClassNames from '../../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../../InputName/InputName.ts'

export const getComposerAttachmentPreviewDom = (attachment: ComposerAttachment): readonly VirtualDomNode[] => {
  if (!attachment.previewSrc) {
    return []
  }
  return [
    {
      alt: `Image preview for ${attachment.name}`,
      childCount: 0,
      className: ClassNames.ChatComposerAttachmentPreview,
      name: InputName.getComposerAttachmentInputName(attachment.attachmentId),
      onContextMenu: DomEventListenerFunctions.HandleContextMenuChatImageAttachment,
      src: attachment.previewSrc,
      type: VirtualDomElements.Img,
    },
  ]
}
