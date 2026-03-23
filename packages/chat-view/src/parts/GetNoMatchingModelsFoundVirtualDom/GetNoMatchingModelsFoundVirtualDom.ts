import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'

export const getNoMatchingModelsFoundVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'Message',
      type: VirtualDomElements.P,
    },
    text(Strings.noMatchingModelsFound()),
  ]
}
