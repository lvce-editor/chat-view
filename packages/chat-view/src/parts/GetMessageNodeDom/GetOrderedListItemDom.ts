import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { MessageListItemNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getInlineNodeDom } from '../GetInlineNodeDom/GetInlineNodeDom.ts'

export const getOrderedListItemDom = (
  item: MessageListItemNode,
  useChatMathWorker: boolean,
  fallbackIndex: number,
  recurseOrdered: (item: MessageListItemNode, useChatMathWorker: boolean, fallbackIndex: number) => readonly VirtualDomNode[],
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
        ...(item.nestedItems || []).flatMap((nestedItem, index) =>
          nestedListType === 'ordered-list'
            ? recurseOrdered(nestedItem, useChatMathWorker, index + 1)
            : recurseUnordered(nestedItem, useChatMathWorker),
        ),
      ]
    : []
  const marker = `${item.index ?? fallbackIndex}.`
  return [
    {
      childCount: item.children.length + (hasNestedList ? 1 : 0) + 1,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 1,
      className: ClassNames.ChatOrderedListMarker,
      type: VirtualDomElements.Span,
    },
    text(marker),
    ...item.children.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
    ...nestedListDom,
  ]
}
