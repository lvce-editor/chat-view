import { text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineCodeNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

const inlineCodeNode: VirtualDomNode = {
  childCount: 1,
  type: VirtualDomElements.Code,
}

export const getInlineCodeInlineNodeDom = (inlineNode: MessageInlineCodeNode): readonly VirtualDomNode[] => {
  return [inlineCodeNode, text(inlineNode.text)]
}
