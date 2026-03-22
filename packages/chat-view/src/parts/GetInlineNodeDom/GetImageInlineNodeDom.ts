import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineImageNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getImageAltText } from './GetImageAltText.ts'

export const getImageInlineNodeDom = (inlineNode: MessageInlineImageNode): readonly VirtualDomNode[] => {
  return [
    {
      alt: getImageAltText(inlineNode.alt),
      childCount: 0,
      className: ClassNames.ImageElement,
      src: inlineNode.src,
      type: VirtualDomElements.Img,
    },
  ]
}
