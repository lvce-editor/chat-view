import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getEmptyChatSessionsDom } from '../GetEmptyChatSessionsDom/GetEmptyChatSessionsDom.ts'
import { getSessionDom } from '../GetSessionDom/GetSessionDom.ts'

export const getChatListDom = (sessions: readonly ChatSession[], selectedSessionId: string, chatListScrollTop = 0): readonly VirtualDomNode[] => {
  if (sessions.length === 0) {
    return getEmptyChatSessionsDom()
  }
  return [
    {
      childCount: sessions.length,
      className: ClassNames.ChatList,
      onClick: DomEventListenerFunctions.HandleClickList,
      onContextMenu: DomEventListenerFunctions.HandleListContextMenu,
      onScroll: DomEventListenerFunctions.HandleChatListScroll,
      scrollTop: chatListScrollTop,
      type: VirtualDomElements.Ul,
    },
    ...sessions.flatMap(getSessionDom),
  ]
}
