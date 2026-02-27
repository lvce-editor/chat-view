import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getEmptyChatSessionsDom } from '../GetEmptyChatSessionsDom/GetEmptyChatSessionsDom.ts'
import { getSessionDom } from '../GetSessionDom/GetSessionDom.ts'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'

export const getChatListDom = (sessions: readonly ChatSession[], selectedSessionId: string): readonly VirtualDomNode[] => {
  if (sessions.length === 0) {
    return getEmptyChatSessionsDom()
  }
  return [
    {
      childCount: sessions.length,
      className: ClassNames.ChatList,
      type: VirtualDomElements.Div,
    },
    ...sessions.flatMap(getSessionDom),
  ]
}
