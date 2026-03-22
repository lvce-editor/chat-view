import { text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineCodeNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

export const getInlineCodeInlineNodeDom = (inlineNode: MessageInlineCodeNode): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      type: VirtualDomElements.Code,
    },
    text(inlineNode.text),
  ]
}
