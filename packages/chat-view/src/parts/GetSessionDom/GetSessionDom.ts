import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getSessionLastActiveTime } from '../GetSessionLastActiveTime/GetSessionLastActiveTime.ts'
import { getSessionStatusClassName } from '../GetSessionStatusClassName/GetSessionStatusClassName.ts'
import * as InputName from '../InputName/InputName.ts'

export const getSessionDom = (session: ChatSession, focused = false, showChatListTime = true): readonly VirtualDomNode[] => {
  const sessionClassName = focused ? mergeClassNames(ClassNames.ChatListItem, ClassNames.ChatListItemFocused) : ClassNames.ChatListItem
  const sessionStatusClassName = getSessionStatusClassName(session)
  const lastActiveTime = getSessionLastActiveTime(session) || 'n/a'
  return [
    {
      childCount: 3,
      className: sessionClassName,
      type: VirtualDomElements.Li,
    },
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
    {
      childCount: showChatListTime ? 2 : 1,
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
          text(lastActiveTime),
        ]
      : []),
    {
      childCount: 1,
      className: ClassNames.ChatActions,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.IconButton, ClassNames.SessionArchiveButton),
      'data-id': session.id,
      name: InputName.SessionDelete,
      onClick: DomEventListenerFunctions.HandleClickDelete,
      tabIndex: 0,
      title: Strings.deleteChatSession(),
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconArchive),
      type: VirtualDomElements.Div,
    },
  ]
}
