import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

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
      className: ClassNames.Button,
      name: `session:${session.id}`,
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
      title: 'Delete chat session',
      type: VirtualDomElements.Button,
    },
    text('🗑'),
  ]
}
