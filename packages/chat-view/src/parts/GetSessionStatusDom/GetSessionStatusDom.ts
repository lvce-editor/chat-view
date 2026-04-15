import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getSessionStatusClassName } from '../GetSessionStatusClassName/GetSessionStatusClassName.ts'

export const getSessionStatusDom = (session: ChatSession): readonly VirtualDomNode[] => {
  const sessionStatusClassName = getSessionStatusClassName(session)

  return [
    {
      childCount: 1,
      className: ClassNames.ChatListItemStatusRow,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: `${ClassNames.ChatListItemStatusIcon} ${sessionStatusClassName}`,
      type: VirtualDomElements.Div,
    },
  ]
}
