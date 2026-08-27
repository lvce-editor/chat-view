import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const chatListItemStatusRowNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ChatListItemStatusRow,
  type: VirtualDomElements.Div,
}

export const getChatListItemStatusDom = (sessionStatusClassName: string): readonly VirtualDomNode[] => {
  return [
    chatListItemStatusRowNode,
    {
      childCount: 0,
      className: mergeClassNames(ClassNames.ChatListItemStatusIcon, sessionStatusClassName),
      type: VirtualDomElements.Div,
    },
  ]
}
