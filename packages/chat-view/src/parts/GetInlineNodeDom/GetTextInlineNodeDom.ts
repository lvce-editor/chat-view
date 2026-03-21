import { text, type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineTextNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

export const getTextInlineNodeDom = (inlineNode: MessageInlineTextNode): readonly VirtualDomNode[] => {
  return [text(inlineNode.text)]
}
