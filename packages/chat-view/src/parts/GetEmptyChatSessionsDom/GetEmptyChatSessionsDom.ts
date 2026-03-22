import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getEmptyChatSessionsDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.ChatListEmpty,
      type: VirtualDomElements.Div,
    },
    { childCount: 1, className: ClassNames.Label, type: VirtualDomElements.Div },
    text(Strings.clickToOpenNewChat()),
  ]
}
