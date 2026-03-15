import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { MessageMathBlockNode, MessageMathInlineNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ChatMathWorker from '../ChatMathWorker/ChatMathWorker.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { parseHtmlToVirtualDomWithRootCount } from '../ParseHtmlToVirtualDom/ParseHtmlToVirtualDom.ts'

const renderMath = (
  value: string,
  displayMode: boolean,
  _useChatMathWorker = false,
): { readonly rootChildCount: number; readonly virtualDom: readonly VirtualDomNode[] } | undefined => {
  try {
    const html = ChatMathWorker.tryRenderToString(value, displayMode)
    if (typeof html !== 'string') {
      return undefined
    }
    return parseHtmlToVirtualDomWithRootCount(html)
  } catch {
    return undefined
  }
}

export const getMathInlineDom = (node: MessageMathInlineNode, useChatMathWorker = false): readonly VirtualDomNode[] => {
  const rendered = renderMath(node.text, node.displayMode, useChatMathWorker)
  if (!rendered) {
    const fallback = node.displayMode ? `$$${node.text}$$` : `$${node.text}$`
    return [text(fallback)]
  }
  return [
    {
      childCount: rendered.rootChildCount,
      className: ClassNames.MarkdownMathInline,
      type: VirtualDomElements.Span,
    },
    ...rendered.virtualDom,
  ]
}

export const getMathBlockDom = (node: MessageMathBlockNode, useChatMathWorker = false): readonly VirtualDomNode[] => {
  const rendered = renderMath(node.text, true, useChatMathWorker)
  if (!rendered) {
    return [
      {
        childCount: 1,
        className: ClassNames.MarkdownMathBlock,
        type: VirtualDomElements.Div,
      },
      text(`$$\n${node.text}\n$$`),
    ]
  }
  return [
    {
      childCount: rendered.rootChildCount,
      className: ClassNames.MarkdownMathBlock,
      type: VirtualDomElements.Div,
    },
    ...rendered.virtualDom,
  ]
}
