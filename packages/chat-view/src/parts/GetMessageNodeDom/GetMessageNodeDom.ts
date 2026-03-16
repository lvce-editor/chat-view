import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type {
  MessageBlockQuoteNode,
  MessageCodeBlockNode,
  MessageHeadingNode,
  MessageIntermediateNode,
  MessageListItemNode,
  MessageTableCellNode,
  MessageTableNode,
  MessageTableRowNode,
} from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getInlineNodeDom } from '../GetInlineNodeDom/GetInlineNodeDom.ts'
import { type CodeToken, highlightCode } from '../HighlightCode/HighlightCode.ts'

const getTokenDom = (token: CodeToken): readonly VirtualDomNode[] => {
  if (!token.className) {
    return [text(token.text)]
  }
  return [
    {
      childCount: 1,
      className: token.className,
      type: VirtualDomElements.Span,
    },
    text(token.text),
  ]
}

const getCodeBlockDom = (node: MessageCodeBlockNode): readonly VirtualDomNode[] => {
  const tokens = highlightCode(node.text, node.language)
  const tokenDom = tokens.flatMap(getTokenDom)
  return [
    {
      childCount: 1,
      type: VirtualDomElements.Pre,
    },
    {
      childCount: tokens.length,
      type: VirtualDomElements.Code,
    },
    ...tokenDom,
  ]
}

const getOrderedListItemDom = (item: MessageListItemNode, useChatMathWorker: boolean): readonly VirtualDomNode[] => {
  const hasNestedUnorderedList = (item.nestedItems?.length || 0) > 0
  const nestedUnorderedListDom = hasNestedUnorderedList
    ? [
        {
          childCount: item.nestedItems?.length || 0,
          className: ClassNames.ChatUnorderedList,
          type: VirtualDomElements.Ul,
        },
        ...(item.nestedItems || []).flatMap((nestedItem) => getUnorderedListItemDom(nestedItem, useChatMathWorker)),
      ]
    : []
  return [
    {
      childCount: item.children.length + (hasNestedUnorderedList ? 1 : 0),
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    ...item.children.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
    ...nestedUnorderedListDom,
  ]
}

const getUnorderedListItemDom = (item: MessageListItemNode, useChatMathWorker: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: item.children.length,
      className: ClassNames.ChatUnorderedListItem,
      type: VirtualDomElements.Li,
    },
    ...item.children.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
  ]
}

const getTableHeadCellDom = (cell: MessageTableCellNode, useChatMathWorker: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: cell.children.length,
      type: VirtualDomElements.Th,
    },
    ...cell.children.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
  ]
}

const getTableBodyCellDom = (cell: MessageTableCellNode, useChatMathWorker: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: cell.children.length,
      type: VirtualDomElements.Td,
    },
    ...cell.children.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
  ]
}

const getTableRowDom = (row: MessageTableRowNode, useChatMathWorker: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: row.cells.length,
      type: VirtualDomElements.Tr,
    },
    ...row.cells.flatMap((cell) => getTableBodyCellDom(cell, useChatMathWorker)),
  ]
}

const getTableDom = (node: MessageTableNode, useChatMathWorker: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: ClassNames.MarkdownTable,
      type: VirtualDomElements.Table,
    },
    {
      childCount: 1,
      type: VirtualDomElements.THead,
    },
    {
      childCount: node.headers.length,
      type: VirtualDomElements.Tr,
    },
    ...node.headers.flatMap((cell) => getTableHeadCellDom(cell, useChatMathWorker)),
    {
      childCount: node.rows.length,
      type: VirtualDomElements.TBody,
    },
    ...node.rows.flatMap((row) => getTableRowDom(row, useChatMathWorker)),
  ]
}

const getHeadingElementType = (level: MessageHeadingNode['level']): number => {
  switch (level) {
    case 1:
      return VirtualDomElements.H1
    case 2:
      return VirtualDomElements.H2
    case 3:
      return VirtualDomElements.H3
    case 4:
      return VirtualDomElements.H4
    case 5:
      return VirtualDomElements.H5
    case 6:
      return VirtualDomElements.H6
  }
}

const getHeadingDom = (node: MessageHeadingNode, useChatMathWorker: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: node.children.length,
      type: getHeadingElementType(node.level),
    },
    ...node.children.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
  ]
}

const getBlockQuoteDom = (node: MessageBlockQuoteNode, useChatMathWorker: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: node.children.length,
      className: ClassNames.MarkdownQuote,
      type: VirtualDomElements.Div,
    },
    ...node.children.flatMap((child) => getMessageNodeDom(child, useChatMathWorker)),
  ]
}

export const getMessageNodeDom = (node: MessageIntermediateNode, useChatMathWorker = false): readonly VirtualDomNode[] => {
  if (node.type === 'text') {
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
    return [
      {
        childCount: 1,
        className: ClassNames.MarkdownMathBlock,
        type: VirtualDomElements.Div,
      },
      text(`$$\n${node.text}\n$$`),
    ]
  }
  if (node.type === 'math-block-dom') {
    return node.dom
  }
  if (node.type === 'heading') {
    return getHeadingDom(node, useChatMathWorker)
  }
  if (node.type === 'blockquote') {
    return getBlockQuoteDom(node, useChatMathWorker)
  }
  if (node.type === 'ordered-list') {
    return [
      {
        childCount: node.items.length,
        className: ClassNames.ChatOrderedList,
        type: VirtualDomElements.Ol,
      },
      ...node.items.flatMap((item) => getOrderedListItemDom(item, useChatMathWorker)),
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
