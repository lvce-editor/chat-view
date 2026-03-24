import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineStrikethroughNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import type { InlineNodeDomRenderer } from './GetInlineNodeDomTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const getStrikethroughInlineNodeDom = (
  inlineNode: MessageInlineStrikethroughNode,
  useChatMathWorker: boolean,
  renderInlineNodeDom: InlineNodeDomRenderer,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: inlineNode.children.length,
      className: ClassNames.StrikeThrough,
      type: VirtualDomElements.Span,
    },
    ...inlineNode.children.flatMap((child) => renderInlineNodeDom(child, useChatMathWorker)),
  ]
}
