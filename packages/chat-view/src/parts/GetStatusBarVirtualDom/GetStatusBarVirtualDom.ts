import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { text } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage, ChatSession } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

const getSessionDom = (session: ChatSession, selectedSessionId: string): readonly VirtualDomNode[] => {
  const selected = session.id === selectedSessionId
  const sessionClassName = selected ? `${ClassNames.List} ${ClassNames.TestActive}` : ClassNames.List
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
      className: ClassNames.Actions,
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

const getMessagesDom = (messages: readonly ChatMessage[]): readonly VirtualDomNode[] => {
  if (messages.length === 0) {
    return [
      {
        childCount: 1,
        className: ClassNames.WelcomeMessage,
        type: VirtualDomElements.Div,
      },
      text('Start a conversation by typing below.'),
    ]
  }
  return messages.flatMap((message) => {
    return [
      {
        childCount: 2,
        className: ClassNames.Message,
        type: VirtualDomElements.Div,
      },
      {
        childCount: 1,
        className: ClassNames.Label,
        type: VirtualDomElements.Strong,
      },
      text(message.role === 'user' ? 'You' : 'Assistant'),
      {
        childCount: 1,
        className: ClassNames.Markdown,
        type: VirtualDomElements.P,
      },
      text(message.text),
    ]
  })
}

export const getStatusBarVirtualDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  composerValue: string,
): readonly VirtualDomNode[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const messages = selectedSession ? selectedSession.messages : []
  const sessionNodes = sessions.flatMap((session) => getSessionDom(session, selectedSessionId))
  const messagesNodes = getMessagesDom(messages)
  const dom: VirtualDomNode[] = [
    {
      childCount: 3,
      className: ClassNames.Viewlet,
      onClick: DomEventListenerFunctions.HandleClick,
      onInput: DomEventListenerFunctions.HandleInput,
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: ClassNames.SideBarLocation,
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
      className: ClassNames.Editor,
      type: VirtualDomElements.Div,
    },
    {
      childCount: Math.max(messagesNodes.length, 0),
      className: ClassNames.EditorContent,
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
