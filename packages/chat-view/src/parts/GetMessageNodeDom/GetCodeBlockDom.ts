import { text, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MessageCodeBlockNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

export const getCodeBlockDom = (node: MessageCodeBlockNode): readonly VirtualDomNode[] => {
  const languageAttribute = node.language
    ? {
        'data-lang': node.language,
      }
    : {}
  return [
    {
      childCount: 1,
      type: VirtualDomElements.Pre,
      ...languageAttribute,
    },
    {
      childCount: 1,
      type: VirtualDomElements.Code,
      ...languageAttribute,
    },
    text(node.text),
  ]
}
