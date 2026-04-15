import { AriaRoles, type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { formatChatListTime } from '../FormatChatListTime/FormatChatListTime.ts'
import { getSessionLastActiveTime } from '../GetSessionLastActiveTime/GetSessionLastActiveTime.ts'
import { getSessionStatusClassName } from '../GetSessionStatusClassName/GetSessionStatusClassName.ts'
import * as InputName from '../InputName/InputName.ts'

export const getSessionDom = (
  session: ChatSession,
  focused = false,
  showChatListTime = true,
  showFocusOutline = false,
  sessionPinningEnabled = true,
): readonly VirtualDomNode[] => {
  const sessionClassName = showFocusOutline
    ? mergeClassNames(ClassNames.ChatListItem, ClassNames.ChatListItemFocused, ClassNames.ChatListItemFocusOutline, ClassNames.FocusOutline)
    : focused
      ? mergeClassNames(ClassNames.ChatListItem, ClassNames.ChatListItemFocused)
      : ClassNames.ChatListItem
  const sessionStatusClassName = getSessionStatusClassName(session)
  const lastActiveTime = getSessionLastActiveTime(session)
  const formattedLastActiveTime = lastActiveTime ? formatChatListTime(lastActiveTime) : 'n/a'
  return [
    {
      childCount: sessionPinningEnabled ? 3 : 2,
      className: sessionClassName,
      'data-pinned': session.pinned ? 'true' : 'false',
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
    {
      childCount: sessionPinningEnabled ? 2 : 1,
      className: ClassNames.ChatActions,
      role: AriaRoles.ToolBar,
      type: VirtualDomElements.Div,
    },
    ...(sessionPinningEnabled
      ? [
          {
            childCount: 1,
            className: mergeClassNames(
              ClassNames.IconButton,
              ClassNames.SessionPinButton,
              session.pinned ? ClassNames.ChatListItemPinned : ClassNames.Empty,
            ),
            'data-id': session.id,
            name: InputName.SessionPin,
            onClick: DomEventListenerFunctions.HandleClickPin,
            tabIndex: 0,
            title: session.pinned ? Strings.unpinChatSession() : Strings.pinChatSession(),
            type: VirtualDomElements.Button,
          },
          {
            childCount: 0,
            className: mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconPinned),
            type: VirtualDomElements.Div,
          },
        ]
      : []),
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
