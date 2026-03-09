import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineNode, MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

const getInlineNodeDom = (inlineNode: MessageInlineNode): readonly VirtualDomNode[] => {
  if (inlineNode.type === 'text') {
    return [text(inlineNode.text)]
  }
  return [
    {
      childCount: 1,
      className: ClassNames.ChatMessageLink,
      'data-href': inlineNode.href,
      onClick: DomEventListenerFunctions.HandleClickLink,
      title: inlineNode.href,
      type: VirtualDomElements.Span,
    },
    text(inlineNode.text),
  ]
}

export const getMessageNodeDom = (node: MessageIntermediateNode): readonly VirtualDomNode[] => {
  if (node.type === 'text') {
    return [
      {
        childCount: node.children.length,
        className: ClassNames.Markdown,
        type: VirtualDomElements.P,
      },
      ...node.children.flatMap(getInlineNodeDom),
    ]
  }
  return [
    {
      childCount: node.items.length,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    ...node.items.flatMap((item) => {
      return [
        {
          childCount: item.children.length,
          className: ClassNames.ChatOrderedListItem,
          type: VirtualDomElements.Li,
        },
        ...item.children.flatMap(getInlineNodeDom),
      ]
    }),
  ]
}
