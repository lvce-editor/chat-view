import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getEmptyChatSessionsDom } from '../GetEmptyChatSessionsDom/GetEmptyChatSessionsDom.ts'
import { getSessionDom } from '../GetSessionDom/GetSessionDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatListDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  listFocusedIndex: number,
  chatListScrollTop = 0,
): readonly VirtualDomNode[] => {
  if (sessions.length === 0) {
    return getEmptyChatSessionsDom()
  }
  return [
    {
      childCount: sessions.length,
      className: ClassNames.ChatList,
      name: InputName.ChatList,
      onClick: DomEventListenerFunctions.HandleClickList,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onScroll: DomEventListenerFunctions.HandleChatListScroll,
      scrollTop: chatListScrollTop,
      tabIndex: 0,
      type: VirtualDomElements.Ul,
    },
    ...sessions.flatMap((session, index) => getSessionDom(session, index === listFocusedIndex)),
  ]
}
