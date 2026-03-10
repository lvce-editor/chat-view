import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type {
  MessageCodeBlockNode,
  MessageIntermediateNode,
  MessageListItemNode,
  MessageTableCellNode,
  MessageTableNode,
  MessageTableRowNode,
} from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getInlineNodeDom } from '../GetInlineNodeDom/GetInlineNodeDom.ts'

const getCodeBlockDom = (node: MessageCodeBlockNode): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      type: VirtualDomElements.Pre,
    },
    {
      childCount: 1,
      type: VirtualDomElements.Code,
    },
    text(node.text),
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
