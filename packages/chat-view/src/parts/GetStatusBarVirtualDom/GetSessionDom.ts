import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDom/GetChatViewDomStrings.ts'

export const getSessionDom = (session: ChatSession, _selectedSessionId: string): readonly VirtualDomNode[] => {
  const sessionClassName = ClassNames.ChatListItem
  return [
    {
      childCount: 2,
      className: sessionClassName,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatName,
      name: `session:${session.id}`,
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
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
      className: ClassNames.IconButton,
      name: `session-delete:${session.id}`,
      role: AriaRoles.Button,
      tabIndex: 0,
      title: Strings.deleteChatSession,
      type: VirtualDomElements.Button,
    },
    text('🗑'),
  ]
}
