import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineBoldNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import type { InlineNodeDomRenderer } from './GetInlineNodeDomTypes.ts'

export const getBoldInlineNodeDom = (
  inlineNode: MessageInlineBoldNode,
  useChatMathWorker: boolean,
  renderInlineNodeDom: InlineNodeDomRenderer,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: inlineNode.children.length,
      type: VirtualDomElements.Strong,
    },
    ...inlineNode.children.flatMap((child) => renderInlineNodeDom(child, useChatMathWorker)),
  ]
}
