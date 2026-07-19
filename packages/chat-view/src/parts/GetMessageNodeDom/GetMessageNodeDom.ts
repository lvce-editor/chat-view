import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { MessageIntermediateNode, MessageListItemNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getInlineNodeDom } from '../GetInlineNodeDom/GetInlineNodeDom.ts'
import { getBlockQuoteDom } from './GetBlockQuoteDom.ts'
import { getCodeBlockDom } from './GetCodeBlockDom.ts'
import { getHeadingDom } from './GetHeadingDom.ts'
import { getOrderedListItemDom } from './GetOrderedListItemDom.ts'
import { getTableDom } from './GetTableDom.ts'
import { getUnorderedListItemDom } from './GetUnorderedListItemDom.ts'
import { hasVisibleInlineContent } from './HasVisibleInlineContent.ts'

const loadingTextNode: VirtualDomNode = {
  childCount: 1,
  className: 'LoadingText',
  type: VirtualDomElements.Div,
}

const markdownMathBlockNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.MarkdownMathBlock,
  type: VirtualDomElements.Div,
}

const thematicBreakNode: VirtualDomNode = {
  childCount: 0,
  type: VirtualDomElements.Hr,
}

const getOrderedListItemDomWithNesting = (
  item: MessageListItemNode,
  useChatMathWorker: boolean,
  fallbackIndex: number,
): readonly VirtualDomNode[] => {
  return getOrderedListItemDom(item, useChatMathWorker, fallbackIndex, getOrderedListItemDomWithNesting, getUnorderedListItemDom)
}

export const getMessageNodeDom = (node: MessageIntermediateNode, useChatMathWorker = false): readonly VirtualDomNode[] => {
  if (node.type === 'loading') {
    return [loadingTextNode, text(node.text)]
  }
  if (node.type === 'text') {
    if (!hasVisibleInlineContent(node.children)) {
      return []
    }
    return [
      {
        childCount: node.children.length,
        className: ClassNames.Markdown,
        type: VirtualDomElements.P,
      },
      ...node.children.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
    ]
  }
  if (node.type === 'table') {
    return getTableDom(node, useChatMathWorker)
  }
  if (node.type === 'code-block') {
    return getCodeBlockDom(node)
  }
  if (node.type === 'math-block') {
    return [markdownMathBlockNode, text(`$$\n${node.text}\n$$`)]
  }
  if (node.type === 'math-block-dom') {
    return node.dom
  }
  if (node.type === 'thematic-break') {
    return [thematicBreakNode]
  }
  if (node.type === 'heading') {
    return getHeadingDom(node, useChatMathWorker)
  }
  if (node.type === 'blockquote') {
    return getBlockQuoteDom(node, useChatMathWorker, getMessageNodeDom)
  }
  if (node.type === 'ordered-list') {
    return [
      {
        childCount: node.items.length,
        className: ClassNames.ChatOrderedList,
        type: VirtualDomElements.Ol,
      },
      ...node.items.flatMap((item, index) => getOrderedListItemDomWithNesting(item, useChatMathWorker, index + 1)),
    ]
  }
  return [
    {
      childCount: node.items.length,
      className: ClassNames.ChatUnorderedList,
      type: VirtualDomElements.Ul,
    },
    ...node.items.flatMap((item) => getUnorderedListItemDom(item, useChatMathWorker)),
  ]
}
