import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageTableCellNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import { getInlineNodeDom } from '../GetInlineNodeDom/GetInlineNodeDom.ts'

export const getTableHeadCellDom = (cell: MessageTableCellNode, useChatMathWorker: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: cell.children.length,
      type: VirtualDomElements.Th,
    },
    ...cell.children.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
  ]
}
