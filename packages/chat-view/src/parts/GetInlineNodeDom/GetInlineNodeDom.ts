import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getInlineNodeDom = (inlineNode: MessageInlineNode, useChatMathWorker = false): readonly VirtualDomNode[] => {
  if (inlineNode.type === 'text') {
    return [text(inlineNode.text)]
  }
  if (inlineNode.type === 'bold') {
    return [
      {
        childCount: inlineNode.children.length,
        type: VirtualDomElements.Strong,
      },
      ...inlineNode.children.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
    ]
  }
  if (inlineNode.type === 'italic') {
    return [
      {
        childCount: inlineNode.children.length,
        type: VirtualDomElements.Em,
      },
      ...inlineNode.children.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
    ]
  }
  if (inlineNode.type === 'math-inline') {
    const fallback = inlineNode.displayMode ? `$$${inlineNode.text}$$` : `$${inlineNode.text}$`
    return [text(fallback)]
  }
  if (inlineNode.type === 'math-inline-dom') {
    return inlineNode.dom
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
