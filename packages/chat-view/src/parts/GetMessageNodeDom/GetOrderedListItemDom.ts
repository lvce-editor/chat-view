import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageListItemNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getInlineNodeDom } from '../GetInlineNodeDom/GetInlineNodeDom.ts'

export const getOrderedListItemDom = (
  item: MessageListItemNode,
  useChatMathWorker: boolean,
  recurseOrdered: (item: MessageListItemNode, useChatMathWorker: boolean) => readonly VirtualDomNode[],
  recurseUnordered: (item: MessageListItemNode, useChatMathWorker: boolean) => readonly VirtualDomNode[],
): readonly VirtualDomNode[] => {
  const hasNestedList = (item.nestedItems?.length || 0) > 0
  const nestedListType = item.nestedListType || 'unordered-list'
  const nestedListDom = hasNestedList
    ? [
        {
          childCount: item.nestedItems?.length || 0,
          className: nestedListType === 'ordered-list' ? ClassNames.ChatOrderedList : ClassNames.ChatUnorderedList,
          type: nestedListType === 'ordered-list' ? VirtualDomElements.Ol : VirtualDomElements.Ul,
        },
        ...(item.nestedItems || []).flatMap((nestedItem) =>
          nestedListType === 'ordered-list' ? recurseOrdered(nestedItem, useChatMathWorker) : recurseUnordered(nestedItem, useChatMathWorker),
        ),
      ]
    : []
  return [
    {
      childCount: item.children.length + (hasNestedList ? 1 : 0),
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    ...item.children.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
    ...nestedListDom,
  ]
}
