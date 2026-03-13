// cspell:ignore katex

import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import katex from 'katex/dist/katex.mjs'
import type { MessageMathBlockNode, MessageMathInlineNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { parseHtmlToVirtualDomWithRootCount } from '../ParseHtmlToVirtualDom/ParseHtmlToVirtualDom.ts'

const renderMath = (
  value: string,
  displayMode: boolean,
): { readonly rootChildCount: number; readonly virtualDom: readonly VirtualDomNode[] } | undefined => {
  try {
    const html = katex.renderToString(value, {
      displayMode,
      throwOnError: true,
    })
    return parseHtmlToVirtualDomWithRootCount(html)
  } catch {
    return undefined
  }
}

export const getMathInlineDom = (node: MessageMathInlineNode): readonly VirtualDomNode[] => {
  const rendered = renderMath(node.text, node.displayMode)
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

export const getMathBlockDom = (node: MessageMathBlockNode): readonly VirtualDomNode[] => {
  const rendered = renderMath(node.text, true)
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
