import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { CodeToken } from '../HighlightCode/HighlightCode.ts'

export const getTokenDom = (token: CodeToken): readonly VirtualDomNode[] => {
  if (!token.className) {
    return [text(token.text)]
  }
  return [
    {
      childCount: 1,
      className: token.className,
      type: VirtualDomElements.Span,
    },
    text(token.text),
  ]
}
