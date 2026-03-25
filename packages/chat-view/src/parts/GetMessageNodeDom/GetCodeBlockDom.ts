import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageCodeBlockNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import { getTokenDom } from './GetTokenDom.ts'

export const getCodeBlockDom = (node: MessageCodeBlockNode): readonly VirtualDomNode[] => {
  const tokenDom = node.codeTokens.flatMap(getTokenDom)
  return [
    {
      childCount: 1,
      type: VirtualDomElements.Pre,
    },
    {
      childCount: node.codeTokens.length,
      type: VirtualDomElements.Code,
    },
    ...tokenDom,
  ]
}
