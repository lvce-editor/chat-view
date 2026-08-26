import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageTableNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getTableHeadCellDom } from './GetTableHeadCellDom.ts'
import { getTableRowDom } from './GetTableRowDom.ts'

const chatTableWrapperNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ChatTableWrapper,
  style: 'padding-bottom: 8px;',
  type: VirtualDomElements.Div,
}

const markdownTableNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.MarkdownTable,
  type: VirtualDomElements.Table,
}

const tableNode: VirtualDomNode = {
  childCount: 1,
  type: VirtualDomElements.THead,
}

export const getTableDom = (node: MessageTableNode, useChatMathWorker: boolean): readonly VirtualDomNode[] => {
  return [
    chatTableWrapperNode,
    markdownTableNode,
    tableNode,
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
