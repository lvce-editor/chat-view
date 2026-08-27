import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'

const chatModeUnsupportedNode: VirtualDomNode = {
  childCount: 1,
  type: VirtualDomElements.Div,
}

export const getChatModeUnsupportedVirtualDom = (): readonly VirtualDomNode[] => {
  return [chatModeUnsupportedNode, text(Strings.unknownViewMode())]
}
