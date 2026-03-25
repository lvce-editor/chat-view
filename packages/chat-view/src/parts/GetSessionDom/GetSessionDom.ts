import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getSessionStatusClassName } from '../GetSessionStatusClassName/GetSessionStatusClassName.ts'
import * as InputName from '../InputName/InputName.ts'

export const getSessionDom = (session: ChatSession, focused = false): readonly VirtualDomNode[] => {
  const sessionClassName = focused ? mergeClassNames(ClassNames.ChatListItem, ClassNames.ChatListItemFocused) : ClassNames.ChatListItem
  const sessionStatusClassName = getSessionStatusClassName(session)
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
      className: `${ClassNames.ChatListItemStatusIcon} codicon codicon-circle-filled ${sessionStatusClassName}`,
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
    text(session.title),
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
      className: 'MaskIcon MaskIconTrash',
      type: VirtualDomElements.Div,
    },
  ]
}
