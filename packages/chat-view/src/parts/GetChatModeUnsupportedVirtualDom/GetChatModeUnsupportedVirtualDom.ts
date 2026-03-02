import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

export const getChatModeUnsupportedVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      type: VirtualDomElements.Div,
    },
    text(Strings.unknownViewMode()),
  ]
}
