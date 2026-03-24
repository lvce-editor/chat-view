import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const parentNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ChatListEmpty,
  type: VirtualDomElements.Div,
}

const labelNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.Label,
  type: VirtualDomElements.Div,
}

export const getEmptyChatSessionsDom = (): readonly VirtualDomNode[] => {
  return [parentNode, labelNode, text(Strings.clickToOpenNewChat())]
}
