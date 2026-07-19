import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { MessageMathBlockNode, MessageMathInlineNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const markdownMathBlockNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.MarkdownMathBlock,
  type: VirtualDomElements.Div,
}

export const getMathInlineDom = (node: MessageMathInlineNode, useChatMathWorker = false): readonly VirtualDomNode[] => {
  const fallback = node.displayMode ? `$$${node.text}$$` : `$${node.text}$`
  return [text(fallback)]
}

export const getMathBlockDom = (node: MessageMathBlockNode, useChatMathWorker = false): readonly VirtualDomNode[] => {
  return [markdownMathBlockNode, text(`$$\n${node.text}\n$$`)]
}
