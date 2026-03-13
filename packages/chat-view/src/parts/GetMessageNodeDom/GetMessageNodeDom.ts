import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type {
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

const getUnorderedListItemDom = (item: MessageListItemNode): readonly VirtualDomNode[] => {
  return [
    {
      childCount: item.children.length,
      className: ClassNames.ChatUnorderedListItem,
      type: VirtualDomElements.Li,
    },
    ...item.children.flatMap(getInlineNodeDom),
  ]
}

const getTableHeadCellDom = (cell: MessageTableCellNode): readonly VirtualDomNode[] => {
  return [
    {
      childCount: cell.children.length,
      type: VirtualDomElements.Th,
    },
    ...cell.children.flatMap(getInlineNodeDom),
  ]
}

const getTableBodyCellDom = (cell: MessageTableCellNode): readonly VirtualDomNode[] => {
  return [
    {
      childCount: cell.children.length,
      type: VirtualDomElements.Td,
    },
    ...cell.children.flatMap(getInlineNodeDom),
  ]
}

const getTableRowDom = (row: MessageTableRowNode): readonly VirtualDomNode[] => {
  return [
    {
      childCount: row.cells.length,
      type: VirtualDomElements.Tr,
    },
    ...row.cells.flatMap(getTableBodyCellDom),
  ]
}

const getTableDom = (node: MessageTableNode): readonly VirtualDomNode[] => {
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
    ...node.headers.flatMap(getTableHeadCellDom),
    {
      childCount: node.rows.length,
      type: VirtualDomElements.TBody,
    },
    ...node.rows.flatMap(getTableRowDom),
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

const getHeadingDom = (node: MessageHeadingNode): readonly VirtualDomNode[] => {
  return [
    {
      childCount: node.children.length,
      type: getHeadingElementType(node.level),
    },
    ...node.children.flatMap(getInlineNodeDom),
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
  if (node.type === 'table') {
    return getTableDom(node)
  }
  if (node.type === 'code-block') {
    return getCodeBlockDom(node)
  }
  if (node.type === 'heading') {
    return getHeadingDom(node)
  }
  if (node.type === 'ordered-list') {
    return [
      {
        childCount: node.items.length,
        className: ClassNames.ChatOrderedList,
        type: VirtualDomElements.Ol,
      },
      ...node.items.flatMap(getOrderedListItemDom),
    ]
  }
  return [
    {
      childCount: node.items.length,
      className: ClassNames.ChatUnorderedList,
      type: VirtualDomElements.Ul,
    },
    ...node.items.flatMap(getUnorderedListItemDom),
  ]
}
