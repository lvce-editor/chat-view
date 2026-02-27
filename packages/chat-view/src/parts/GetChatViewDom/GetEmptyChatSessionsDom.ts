import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as Strings from './GetChatViewDomStrings.ts'

export const getEmptyChatSessionsDom = (sessionsLength: number): readonly VirtualDomNode[] => {
  if (sessionsLength !== 0) {
    return []
  }
  return [
    {
      childCount: 1,
      className: ClassNames.Label,
      type: VirtualDomElements.Div,
    },
    text(Strings.clickToOpenNewChat),
  ]
}
