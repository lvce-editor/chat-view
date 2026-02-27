import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getChatHeaderDom = (sessionsLength: number): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: ClassNames.ChatHeader,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: ClassNames.ChatActions,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.Label,
      type: VirtualDomElements.Span,
    },
    text('Chats'),
    {
      childCount: 1,
      className: ClassNames.IconButton,
      name: 'create-session',
      role: AriaRoles.Button,
      tabIndex: 0,
      title: 'New Chat',
      type: VirtualDomElements.Button,
    },
    text('+'),
    {
      childCount: sessionsLength,
      className: ClassNames.ChatList,
      type: VirtualDomElements.Div,
    },
  ]
}