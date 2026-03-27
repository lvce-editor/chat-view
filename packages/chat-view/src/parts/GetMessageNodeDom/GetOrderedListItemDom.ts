import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineNode, MessageInlineTextNode, MessageListItemNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getInlineNodeDom } from '../GetInlineNodeDom/GetInlineNodeDom.ts'

const leadingPunctuationRegex = /^([:;,.!?]+)([\s\S]*)$/

const splitLeadingPunctuation = (
  children: readonly MessageInlineNode[],
): {
  readonly prefixChildren: readonly MessageInlineNode[]
  readonly remainingChildren: readonly MessageInlineNode[]
} => {
  const [firstChild, secondChild, ...restChildren] = children
  if (firstChild?.type !== 'bold' || secondChild?.type !== 'text') {
    return {
      prefixChildren: [],
      remainingChildren: children,
    }
  }
  const match = secondChild.text.match(leadingPunctuationRegex)
  if (!match) {
    return {
      prefixChildren: [],
      remainingChildren: children,
    }
  }
  const [, punctuation, remainingText] = match
  const nextChildren: MessageInlineNode[] = restChildren
  if (remainingText) {
    nextChildren.unshift({
      text: remainingText,
      type: 'text',
    } satisfies MessageInlineTextNode)
  }
  return {
    prefixChildren: [
      firstChild,
      {
        text: punctuation,
        type: 'text',
      },
    ],
    remainingChildren: nextChildren,
  }
}

export const getOrderedListItemDom = (
  item: MessageListItemNode,
  useChatMathWorker: boolean,
  fallbackIndex: number,
  recurseOrdered: (item: MessageListItemNode, useChatMathWorker: boolean, fallbackIndex: number) => readonly VirtualDomNode[],
  recurseUnordered: (item: MessageListItemNode, useChatMathWorker: boolean) => readonly VirtualDomNode[],
): readonly VirtualDomNode[] => {
  const hasNestedList = (item.nestedItems?.length || 0) > 0
  const nestedListType = item.nestedListType || 'unordered-list'
  const { prefixChildren, remainingChildren } = splitLeadingPunctuation(item.children)
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
  const prefixDom =
    prefixChildren.length === 0
      ? []
      : [
          {
            childCount: prefixChildren.length,
            className: ClassNames.ChatOrderedListItemPrefix,
            type: VirtualDomElements.Span,
          },
          ...prefixChildren.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
        ]
  return [
    {
      childCount: 2,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 1,
      className: ClassNames.ChatOrderedListMarker,
      type: VirtualDomElements.Span,
    },
    text(marker),
    {
      childCount: (prefixDom.length === 0 ? 0 : 1) + remainingChildren.length + (hasNestedList ? 1 : 0),
      className: ClassNames.ChatOrderedListItemContent,
      type: VirtualDomElements.Div,
    },
    ...prefixDom,
    ...remainingChildren.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
    ...nestedListDom,
  ]
}
