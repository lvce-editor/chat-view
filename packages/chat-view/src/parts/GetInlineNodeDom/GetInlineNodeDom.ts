import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getInlineNodeDom = (inlineNode: MessageInlineNode): readonly VirtualDomNode[] => {
  if (inlineNode.type === 'text') {
    return [text(inlineNode.text)]
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
