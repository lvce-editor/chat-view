import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'

const parentNode: VirtualDomNode = {
  childCount: 1,
  className: 'Message',
  type: VirtualDomElements.P,
}

export const getNoMatchingModelsFoundVirtualDom = (): readonly VirtualDomNode[] => {
  return [parentNode, text(Strings.noMatchingModelsFound())]
}
