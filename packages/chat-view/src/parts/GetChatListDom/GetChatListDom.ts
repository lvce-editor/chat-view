import { AriaRoles, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatListToggleDom } from '../GetChatListToggleDom/GetChatListToggleDom.ts'
import { getEmptyChatSessionsDom } from '../GetEmptyChatSessionsDom/GetEmptyChatSessionsDom.ts'
import { getSessionDom } from '../GetSessionDom/GetSessionDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatListDom = (
  sessions: readonly ChatSession[],
<<<<<<< HEAD
  listSelectedSessionId: string,
=======
  selectedSessionId: string,
  chatListExpanded: boolean,
>>>>>>> origin/main
  listFocusOutline: boolean,
  listFocusedIndex: number,
  showChatListTime: boolean,
  chatListScrollTop = 0,
): readonly VirtualDomNode[] => {
  if (sessions.length === 0) {
    return getEmptyChatSessionsDom()
  }
<<<<<<< HEAD
  const activeDescendant = sessions.some((session) => session.id === listSelectedSessionId)
    ? InputName.getSessionInputName(listSelectedSessionId)
    : undefined
=======
  const hasHiddenSessions = sessions.length > 3
  const leadingSessions = hasHiddenSessions ? sessions.slice(0, 3) : sessions
  const trailingSessions = hasHiddenSessions && chatListExpanded ? sessions.slice(3) : []
  const childCount = leadingSessions.length + trailingSessions.length + (hasHiddenSessions ? 1 : 0)
>>>>>>> origin/main
  return [
    {
      childCount,
      className: ClassNames.ChatList,
      name: InputName.ChatList,
      onClick: DomEventListenerFunctions.HandleClickList,
      onContextMenu: DomEventListenerFunctions.HandleListContextMenu,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onScroll: DomEventListenerFunctions.HandleChatListScroll,
      'aria-activedescendant': activeDescendant,
      role: AriaRoles.ListBox,
      scrollTop: chatListScrollTop,
      tabIndex: 0,
      type: VirtualDomElements.Ul,
    },
<<<<<<< HEAD
    ...sessions.flatMap((session, index) =>
      getSessionDom(
        session,
        session.id === listSelectedSessionId,
        index === listFocusedIndex,
        showChatListTime,
        listFocusOutline && index === listFocusedIndex,
      ),
=======
    ...leadingSessions.flatMap((session, index) =>
      getSessionDom(session, index === listFocusedIndex, showChatListTime, listFocusOutline && index === listFocusedIndex),
>>>>>>> origin/main
    ),
    ...(hasHiddenSessions ? getChatListToggleDom(chatListExpanded, sessions.length - 3) : []),
    ...trailingSessions.flatMap((session, index) => {
      const actualIndex = index + 3
      return getSessionDom(session, actualIndex === listFocusedIndex, showChatListTime, listFocusOutline && actualIndex === listFocusedIndex)
    }),
  ]
}
