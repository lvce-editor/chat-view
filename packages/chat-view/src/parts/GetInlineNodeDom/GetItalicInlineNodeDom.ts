import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineItalicNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import type { InlineNodeDomRenderer } from './GetInlineNodeDomTypes.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const getItalicInlineNodeDom = (
  inlineNode: MessageInlineItalicNode,
  useChatMathWorker: boolean,
  renderInlineNodeDom: InlineNodeDomRenderer,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: inlineNode.children.length,
      type: VirtualDomElements.Em,
    },
    ...inlineNode.children.flatMap((child) => renderInlineNodeDom(child, useChatMathWorker)),
  ]
}
