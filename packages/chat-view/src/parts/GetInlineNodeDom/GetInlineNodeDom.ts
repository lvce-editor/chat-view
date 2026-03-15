import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getMathInlineDom } from '../GetMathDom/GetMathDom.ts'

export const getInlineNodeDom = (inlineNode: MessageInlineNode, useChatMathWorker = false): readonly VirtualDomNode[] => {
  if (inlineNode.type === 'text') {
    return [text(inlineNode.text)]
  }
  if (inlineNode.type === 'bold') {
    return [
      {
        childCount: 1,
        type: VirtualDomElements.Strong,
      },
      text(inlineNode.text),
    ]
  }
  if (inlineNode.type === 'italic') {
    return [
      {
        childCount: 1,
        type: VirtualDomElements.Em,
      },
      text(inlineNode.text),
    ]
  }
  if (inlineNode.type === 'bold-italic') {
    return [
      {
        childCount: 2,
        type: VirtualDomElements.Strong,
      },
      {
        childCount: 1,
        type: VirtualDomElements.Em,
      },
      text(inlineNode.text),
    ]
  }
  if (inlineNode.type === 'math-inline') {
    return getMathInlineDom(inlineNode, useChatMathWorker)
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
