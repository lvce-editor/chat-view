import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ComposerAttachment } from '../../ComposerAttachment/ComposerAttachment.ts'
import * as ClassNames from '../../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../../InputName/InputName.ts'
import { getComposerAttachmentClassName } from '../GetComposerAttachmentClassName/GetComposerAttachmentClassName.ts'
import { getComposerAttachmentLabel } from '../GetComposerAttachmentLabel/GetComposerAttachmentLabel.ts'
import { getComposerAttachmentPreviewDom } from '../GetComposerAttachmentPreviewDom/GetComposerAttachmentPreviewDom.ts'
import { getComposerAttachmentRemoveButtonDom } from '../GetComposerAttachmentRemoveButtonDom/GetComposerAttachmentRemoveButtonDom.ts'

export const getComposerAttachmentsDom = (composerAttachments: readonly ComposerAttachment[]): readonly VirtualDomNode[] => {
  if (composerAttachments.length === 0) {
    return []
  }
  return [
    {
      childCount: composerAttachments.length,
      className: ClassNames.ChatComposerAttachments,
      type: VirtualDomElements.Div,
    },
    ...composerAttachments.flatMap((attachment) => {
      const removeButtonDom = getComposerAttachmentRemoveButtonDom(attachment)
      const previewDom = getComposerAttachmentPreviewDom(attachment)
      return [
        {
          childCount: 1 + (removeButtonDom.length > 0 ? 1 : 0) + previewDom.length,
          className: mergeClassNames(ClassNames.ChatComposerAttachment, getComposerAttachmentClassName(attachment.displayType)),
          name: InputName.getComposerAttachmentInputName(attachment.attachmentId),
          onMouseOut: DomEventListenerFunctions.HandleMouseOut,
          onMouseOver: DomEventListenerFunctions.HandleMouseOver,
          onPointerOut: DomEventListenerFunctions.HandleMouseOut,
          onPointerOver: DomEventListenerFunctions.HandleMouseOver,
          type: VirtualDomElements.Div,
        },
        ...removeButtonDom,
        ...previewDom,
        {
          childCount: 1,
          className: ClassNames.ChatComposerAttachmentLabel,
          name: InputName.getComposerAttachmentInputName(attachment.attachmentId),
          type: VirtualDomElements.Span,
        },
        {
          text: `${getComposerAttachmentLabel(attachment.displayType)} · ${attachment.name}`,
          type: VirtualDomElements.Text,
        },
      ]
    }),
  ]
}
