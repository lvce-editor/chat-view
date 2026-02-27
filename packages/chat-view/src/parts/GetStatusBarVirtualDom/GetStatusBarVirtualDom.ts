import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { text } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../StatusBarState/StatusBarState.ts'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatContentDom } from './GetChatContentDom.ts'
import { getChatHeaderActionsDom } from './GetChatHeaderActionsDom.ts'
import { getChatHeaderDom } from './GetChatHeaderDom.ts'
import { getMessagesDom } from './GetMessagesDom.ts'
import { getSessionDom } from './GetSessionDom.ts'
import * as Strings from './GetStatusBarVirtualDomStrings.ts'

function getEmptyChatSessionsDom(sessionsLength: number): readonly VirtualDomNode[] {
  if (sessionsLength !== 0) {
    return []
  }
  return [
    {
      childCount: 1,
      className: ClassNames.Label,
      type: VirtualDomElements.Div,
    },
    text(Strings.clickToOpenNewChat),
  ]
}

export const getChatVirtualDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  composerValue: string,
  viewMode: ChatViewMode,
): readonly VirtualDomNode[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const selectedSessionTitle = selectedSession?.title || Strings.chatTitle
  const messages: readonly ChatMessage[] = selectedSession ? selectedSession.messages : []
  const showBackButton = viewMode === 'detail'
  const sessionNodes = sessions.flatMap((session) => getSessionDom(session, selectedSessionId))
  const messagesNodes = getMessagesDom(messages)
  const emptyStateNodes = getEmptyChatSessionsDom(sessions.length)
  const contentNodes = getChatContentDom(
    viewMode,
    sessions.length,
    emptyStateNodes,
    sessionNodes,
    selectedSessionTitle,
    messagesNodes,
    composerValue,
  )
  const dom: VirtualDomNode[] = [
    {
      childCount: 2,
      className: ClassNames.Viewlet + ' Chat',
      onClick: DomEventListenerFunctions.HandleClick,
      onInput: DomEventListenerFunctions.HandleInput,
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      type: VirtualDomElements.Div,
    },
    ...getChatHeaderDom(showBackButton, selectedSessionTitle),
    ...getChatHeaderActionsDom(),
    text('×'),
    ...contentNodes,
  ]
  return dom
}
