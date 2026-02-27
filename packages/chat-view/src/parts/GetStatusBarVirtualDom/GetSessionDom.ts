import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getSessionDom = (session: ChatSession, selectedSessionId: string): readonly VirtualDomNode[] => {
  const selected = session.id === selectedSessionId
  const sessionClassName = selected ? `${ClassNames.ChatList} ${ClassNames.TestActive}` : ClassNames.ChatList
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
      role: AriaRoles.Button,
      tabIndex: 0,
      type: VirtualDomElements.Button,
    },
    text(session.title),
    {
      childCount: 2,
      className: ClassNames.ChatActions,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.IconButton,
      name: `session-rename:${session.id}`,
      role: AriaRoles.Button,
      tabIndex: 0,
      title: 'Rename chat session',
      type: VirtualDomElements.Button,
    },
    text('Rename'),
    {
      childCount: 1,
      className: ClassNames.IconButton,
      name: `session-delete:${session.id}`,
      role: AriaRoles.Button,
      tabIndex: 0,
      title: 'Delete chat session',
      type: VirtualDomElements.Button,
    },
    text('Delete'),
  ]
}
