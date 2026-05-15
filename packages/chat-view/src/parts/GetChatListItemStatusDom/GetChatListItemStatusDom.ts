import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getChatListItemStatusDom = (sessionStatusClassName: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.ChatListItemStatusRow,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: mergeClassNames(ClassNames.ChatListItemStatusIcon, sessionStatusClassName),
      type: VirtualDomElements.Div,
    },
  ]
}
