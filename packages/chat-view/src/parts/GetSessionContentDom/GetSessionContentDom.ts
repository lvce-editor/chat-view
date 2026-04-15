import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { formatChatListTime } from '../FormatChatListTime/FormatChatListTime.ts'
import { getSessionLastActiveTime } from '../GetSessionLastActiveTime/GetSessionLastActiveTime.ts'
import * as InputName from '../InputName/InputName.ts'

export const getSessionContentDom = (session: ChatSession, showChatListTime = true): readonly VirtualDomNode[] => {
  const lastActiveTime = getSessionLastActiveTime(session)
  const formattedLastActiveTime = lastActiveTime ? formatChatListTime(lastActiveTime) : 'n/a'

  return [
    {
      childCount: showChatListTime ? 2 : 1,
      className: ClassNames.ChatListItemContent,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatListItemLabel,
      name: InputName.getSessionInputName(session.id),
      onContextMenu: DomEventListenerFunctions.HandleListContextMenu,
      onFocus: DomEventListenerFunctions.HandleFocus,
      tabIndex: 0,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatListItemTitle,
      type: VirtualDomElements.Div,
    },
    text(session.title),
    ...(showChatListTime
      ? [
          {
            childCount: 1,
            className: ClassNames.ChatListItemTime,
            type: VirtualDomElements.Div,
          },
          text(formattedLastActiveTime),
        ]
      : []),
  ]
}
