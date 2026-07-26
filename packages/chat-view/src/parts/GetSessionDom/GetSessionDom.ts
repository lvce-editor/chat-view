import { AriaRoles, type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { formatChatListTime } from '../FormatChatListTime/FormatChatListTime.ts'
import { getChatListItemActionsDom } from '../GetChatListItemActionsDom/GetChatListItemActionsDom.ts'
import { getChatListItemStatusDom } from '../GetChatListItemStatusDom/GetChatListItemStatusDom.ts'
import { getSessionClassName } from '../GetSessionClassName/GetSessionClassName.ts'
import { getSessionLastActiveTime } from '../GetSessionLastActiveTime/GetSessionLastActiveTime.ts'
import { getSessionStatusClassName } from '../GetSessionStatusClassName/GetSessionStatusClassName.ts'
import * as InputName from '../InputName/InputName.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'

export const getSessionDom = (
  session: ChatSession,
  focused = false,
  showChatListTime = true,
  showFocusOutline = false,
): readonly VirtualDomNode[] => {
  const sessionClassName = getSessionClassName(focused, showFocusOutline)
  const sessionInputName = InputName.getSessionInputName(session.id)
  const sessionStatusClassName = getSessionStatusClassName(session)
  const lastActiveTime = getSessionLastActiveTime(session)
  const formattedLastActiveTime = lastActiveTime ? formatChatListTime(lastActiveTime) : 'n/a'
  const lastActiveTimeDom = showChatListTime
    ? [
        {
          childCount: 1,
          className: ClassNames.ChatListItemTime,
          name: sessionInputName,
          type: VirtualDomElements.Div,
        },
        text(formattedLastActiveTime),
      ]
    : []
  return [
    {
      childCount: 3,
      className: sessionClassName,
      type: VirtualDomElements.Li,
    },
    ...getChatListItemStatusDom(sessionStatusClassName),
    {
      childCount: showChatListTime ? 2 : 1,
      className: ClassNames.ChatListItemContent,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatListItemLabel,
      name: sessionInputName,
      onClick: DomEventListenerFunctions.HandleClickSession,
      onContextMenu: DomEventListenerFunctions.HandleListContextMenu,
      onFocus: DomEventListenerFunctions.HandleFocus,
      role: AriaRoles.Button,
      tabIndex: TabIndex.Focusable,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatListItemTitle,
      name: sessionInputName,
      type: VirtualDomElements.Div,
    },
    text(session.title),
    ...lastActiveTimeDom,
    ...getChatListItemActionsDom(session),
  ]
}
