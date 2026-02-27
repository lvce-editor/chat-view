import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatHeaderListModeDom } from '../GetChatHeaderDomListMode/GetChatHeaderDomListMode.ts'
import { getEmptyChatSessionsDom } from '../GetChatViewDom/GetEmptyChatSessionsDom.ts'
import { getSessionDom } from '../GetChatViewDom/GetSessionDom.ts'

export const getChatListDom = (sessions: readonly ChatSession[], selectedSessionId: string): readonly VirtualDomNode[] => {
  const sessionNodes = sessions.flatMap((session) => getSessionDom(session, selectedSessionId))
  const emptyStateNodes = getEmptyChatSessionsDom(sessions.length)
  return [
    {
      childCount: sessions.length === 0 ? 1 : sessions.length,
      className: ClassNames.ChatList,
      type: VirtualDomElements.Div,
    },
    ...(sessions.length === 0 ? emptyStateNodes : sessionNodes),
  ]
}

export const getChatModeListVirtualDom = (sessions: readonly ChatSession[], selectedSessionId: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Chat),
      onClick: DomEventListenerFunctions.HandleClick,
      onInput: DomEventListenerFunctions.HandleInput,
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      type: VirtualDomElements.Div,
    },
    ...getChatHeaderListModeDom(),
    ...getChatListDom(sessions, selectedSessionId),
  ]
}
