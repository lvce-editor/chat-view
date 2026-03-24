import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageCodeBlockNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import { highlightCode } from '../HighlightCode/HighlightCode.ts'
import { getTokenDom } from './GetTokenDom.ts'

export const getCodeBlockDom = (node: MessageCodeBlockNode): readonly VirtualDomNode[] => {
  const tokens = highlightCode(node.text, node.language)
  const tokenDom = tokens.flatMap(getTokenDom)
  return [
    {
      childCount: 1,
      type: VirtualDomElements.Pre,
    },
    {
      childCount: tokens.length,
      type: VirtualDomElements.Code,
    },
    ...tokenDom,
  ]
}
