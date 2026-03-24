import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageTableRowNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import { getTableBodyCellDom } from './GetTableBodyCellDom.ts'

export const getTableRowDom = (row: MessageTableRowNode, useChatMathWorker: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: row.cells.length,
      type: VirtualDomElements.Tr,
    },
    ...row.cells.flatMap((cell) => getTableBodyCellDom(cell, useChatMathWorker)),
  ]
}
