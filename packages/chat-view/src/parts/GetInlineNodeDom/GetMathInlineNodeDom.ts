import { text, type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { MessageMathInlineNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

export const getMathInlineNodeDom = (inlineNode: MessageMathInlineNode): readonly VirtualDomNode[] => {
  const fallback = inlineNode.displayMode ? `$$${inlineNode.text}$$` : `$${inlineNode.text}$`
  return [text(fallback)]
}
