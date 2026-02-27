import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { text } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import type { ChatViewMode } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getMessagesDom } from './GetMessagesDom.ts'
import { getSessionDom } from './GetSessionDom.ts'

export const getChatVirtualDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  composerValue: string,
  viewMode: ChatViewMode,
): readonly VirtualDomNode[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const messages = selectedSession ? selectedSession.messages : []
  const sessionNodes = sessions.flatMap((session) => getSessionDom(session, selectedSessionId))
  const messagesNodes = getMessagesDom(messages)
  const contentNodes: readonly VirtualDomNode[] =
    viewMode === 'list'
      ? [
          {
            childCount: sessions.length,
            className: ClassNames.ChatList,
            type: VirtualDomElements.Div,
          },
          ...sessionNodes,
        ]
      : [
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
            childCount: 2,
            className: ClassNames.ChatSendArea,
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
          {
            childCount: 1,
            className: ClassNames.Button + ' ' + ClassNames.ButtonPrimary,
            name: 'send',
            role: AriaRoles.Button,
            tabIndex: 0,
            title: 'Send message',
            type: VirtualDomElements.Button,
          },
          text('Send'),
        ]
  const dom: VirtualDomNode[] = [
    {
      childCount: 2,
      className: ClassNames.Viewlet + ' Chat',
      onClick: DomEventListenerFunctions.HandleClick,
      onInput: DomEventListenerFunctions.HandleInput,
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: ClassNames.ChatHeader,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.Label,
      type: VirtualDomElements.Span,
    },
    text('Chats'),
    {
      childCount: 3,
      className: ClassNames.ChatActions,
      type: VirtualDomElements.Div,
    },
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
      childCount: 1,
      className: ClassNames.IconButton,
      onClick: DomEventListenerFunctions.HandleClickSettings,
      role: AriaRoles.Button,
      tabIndex: 0,
      title: 'Settings',
      type: VirtualDomElements.Button,
    },
    text('⚙'),
    {
      childCount: 1,
      className: ClassNames.IconButton,
      onClick: DomEventListenerFunctions.HandleClickClose,
      role: AriaRoles.Button,
      tabIndex: 0,
      title: 'Close Chat',
      type: VirtualDomElements.Button,
    },
    text('×'),
    ...contentNodes,
  ]
  return dom
}
