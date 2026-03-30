import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

const getImageCouldNotBeLoadedDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.ChatComposerAttachmentPreviewOverlayError, ClassNames.ImageErrorMessage),
      name: InputName.ComposerAttachmentPreviewOverlay,
      type: VirtualDomElements.Div,
    },
    {
      text: Strings.imageCouldNotBeLoaded(),
      type: VirtualDomElements.Text,
    },
  ]
}

export const getComposerAttachmentPreviewOverlayVirtualDom = (
  composerAttachments: readonly ComposerAttachment[],
  attachmentId: string,
  hasError: boolean,
): readonly VirtualDomNode[] => {
  if (!attachmentId) {
    return []
  }
  const attachment = composerAttachments.find((item) => item.attachmentId === attachmentId)
  if (!attachment || attachment.displayType !== 'image' || !attachment.previewSrc) {
    return []
  }
  return [
    {
      childCount: 1,
      className: ClassNames.ChatComposerAttachmentPreviewOverlay,
      name: InputName.ComposerAttachmentPreviewOverlay,
      onMouseOut: DomEventListenerFunctions.HandleMouseOut,
      onMouseOver: DomEventListenerFunctions.HandleMouseOver,
      onPointerOut: DomEventListenerFunctions.HandleMouseOut,
      onPointerOver: DomEventListenerFunctions.HandleMouseOver,
      type: VirtualDomElements.Div,
    },
    ...(hasError
      ? getImageCouldNotBeLoadedDom()
      : [
          {
            alt: `Large image preview for ${attachment.name}`,
            childCount: 0,
            className: ClassNames.ChatComposerAttachmentPreviewOverlayImage,
            name: InputName.ComposerAttachmentPreviewOverlay,
            onError: DomEventListenerFunctions.HandleErrorComposerAttachmentPreviewOverlay,
            src: attachment.previewSrc,
            type: VirtualDomElements.Img,
          },
        ]),
  ]
}
