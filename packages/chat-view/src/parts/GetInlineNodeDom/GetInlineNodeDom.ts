import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import { getBoldInlineNodeDom } from './GetBoldInlineNodeDom.ts'
import { getImageInlineNodeDom } from './GetImageInlineNodeDom.ts'
import { getInlineCodeInlineNodeDom } from './GetInlineCodeInlineNodeDom.ts'
import { getItalicInlineNodeDom } from './GetItalicInlineNodeDom.ts'
import { getLinkInlineNodeDom } from './GetLinkInlineNodeDom.ts'
import { getMathInlineNodeDom } from './GetMathInlineNodeDom.ts'
import { getStrikethroughInlineNodeDom } from './GetStrikethroughInlineNodeDom.ts'
import { getTextInlineNodeDom } from './GetTextInlineNodeDom.ts'

export const getInlineNodeDom = (inlineNode: MessageInlineNode, useChatMathWorker = false): readonly VirtualDomNode[] => {
  switch (inlineNode.type) {
    case 'text':
      return getTextInlineNodeDom(inlineNode)
    case 'image':
      return getImageInlineNodeDom(inlineNode)
    case 'bold':
      return getBoldInlineNodeDom(inlineNode, useChatMathWorker, getInlineNodeDom)
    case 'italic':
      return getItalicInlineNodeDom(inlineNode, useChatMathWorker, getInlineNodeDom)
    case 'strikethrough':
      return getStrikethroughInlineNodeDom(inlineNode, useChatMathWorker, getInlineNodeDom)
    case 'inline-code':
      return getInlineCodeInlineNodeDom(inlineNode)
    case 'math-inline':
      return getMathInlineNodeDom(inlineNode)
    case 'math-inline-dom':
      return inlineNode.dom
    case 'link':
      return getLinkInlineNodeDom(inlineNode)
  }
  const exhaustiveCheck: never = inlineNode
  return exhaustiveCheck
}
