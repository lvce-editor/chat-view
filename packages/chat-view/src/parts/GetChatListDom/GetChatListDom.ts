import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getEmptyChatSessionsDom } from '../GetEmptyChatSessionsDom/GetEmptyChatSessionsDom.ts'
import { getSessionDom } from '../GetSessionDom/GetSessionDom.ts'

export const getChatListDom = (sessions: readonly ChatSession[], selectedSessionId: string): readonly VirtualDomNode[] => {
  if (sessions.length === 0) {
    return getEmptyChatSessionsDom()
  }
  return [
    {
      childCount: sessions.length,
      className: ClassNames.ChatList,
      onClick: DomEventListenerFunctions.HandleClickList,
      type: VirtualDomElements.Div,
    },
    ...sessions.flatMap(getSessionDom),
  ]
}
