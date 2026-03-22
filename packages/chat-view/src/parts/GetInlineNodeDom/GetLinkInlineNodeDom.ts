import { text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineLinkNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { isFileReferenceUri } from './IsFileReferenceUri.ts'

export const getLinkInlineNodeDom = (inlineNode: MessageInlineLinkNode): readonly VirtualDomNode[] => {
  if (isFileReferenceUri(inlineNode.href)) {
    return [
      {
        childCount: 1,
        className: ClassNames.ChatMessageLink,
        'data-uri': inlineNode.href,
        href: '#',
        onClick: DomEventListenerFunctions.HandleClickReadFile,
        title: inlineNode.href,
        type: VirtualDomElements.A,
      },
      text(inlineNode.text),
    ]
  }
  return [
    {
      childCount: 1,
      className: ClassNames.ChatMessageLink,
      href: inlineNode.href,
      rel: 'noopener noreferrer',
      target: '_blank',
      title: inlineNode.href,
      type: VirtualDomElements.A,
    },
    text(inlineNode.text),
  ]
}
