import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { MessageIntermediateNode, MessageListItemNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getInlineNodeDom } from '../GetInlineNodeDom/GetInlineNodeDom.ts'
import { parseHtmlToVirtualDomWithRootCount } from '../ParseHtmlToVirtualDom/ParseHtmlToVirtualDom.ts'

const getOrderedListItemDom = (item: MessageListItemNode): readonly VirtualDomNode[] => {
  return [
    {
      childCount: item.children.length,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    ...item.children.flatMap(getInlineNodeDom),
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
  if (node.type === 'custom-ui') {
    const parsed = parseHtmlToVirtualDomWithRootCount(node.html)
    return [
      {
        childCount: 1,
        className: ClassNames.ChatCustomUiContent,
        type: VirtualDomElements.Div,
      },
      {
        childCount: parsed.rootChildCount,
        className: ClassNames.ChatCustomUiBody,
        type: VirtualDomElements.Div,
      },
      ...parsed.virtualDom,
    ]
  }
  if (node.type === 'raw-content') {
    return [
      {
        childCount: 1,
        className: ClassNames.Markdown,
        type: VirtualDomElements.Pre,
      },
      text(node.text),
    ]
  }
  return [
    {
      childCount: node.items.length,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    ...node.items.flatMap(getOrderedListItemDom),
  ]
}
