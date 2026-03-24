import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageBlockQuoteNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getBlockQuoteDom = (
  node: MessageBlockQuoteNode,
  useChatMathWorker: boolean,
  getMessageNodeDom: (node: MessageBlockQuoteNode['children'][number], useChatMathWorker: boolean) => readonly VirtualDomNode[],
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: node.children.length,
      className: ClassNames.MarkdownQuote,
      type: VirtualDomElements.Div,
    },
    ...node.children.flatMap((child) => getMessageNodeDom(child, useChatMathWorker)),
  ]
}
