import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { text } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getMessagesDom } from './GetMessagesDom.ts'
import { getSessionDom } from './GetSessionDom.ts'

export const getChatVirtualDom = (sessions: readonly ChatSession[], selectedSessionId: string, composerValue: string): readonly VirtualDomNode[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const messages = selectedSession ? selectedSession.messages : []
  const sessionNodes = sessions.flatMap((session) => getSessionDom(session, selectedSessionId))
  const messagesNodes = getMessagesDom(messages)
  const dom: VirtualDomNode[] = [
    {
      childCount: 3,
      className: ClassNames.Viewlet + ' Chat',
      onClick: DomEventListenerFunctions.HandleClick,
      onInput: DomEventListenerFunctions.HandleInput,
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: ClassNames.chatHeader,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: ClassNames.Actions,
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
      childCount: sessions.length,
      className: ClassNames.ListItems,
      type: VirtualDomElements.Div,
    },
    ...sessionNodes,
    {
      childCount: 2,
      className: ClassNames.ChatDetails,
      type: VirtualDomElements.Div,
    },
    {
      childCount: Math.max(messagesNodes.length, 0),
      className: ClassNames.ChatDetailsContent,
      type: VirtualDomElements.Div,
    },
    ...messagesNodes,
    {
      childCount: 1,
      className: ClassNames.Actions,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: ClassNames.MultilineInputBox,
      name: 'composer',
      placeholder: 'Type your message. Enter to send, Shift+Enter for newline.',
      rows: 4,
      type: VirtualDomElements.TextArea,
      value: composerValue,
    },
  ]
  return dom
}
