import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatDetailsDom } from './GetChatDetailsDom.ts'
import { getChatHeaderDom } from './GetChatHeaderDom.ts'
import { getMessagesDom } from './GetMessagesDom.ts'
import { getSessionDom } from './GetSessionDom.ts'

export const getChatVirtualDom = (sessions: readonly ChatSession[], selectedSessionId: string, composerValue: string): readonly VirtualDomNode[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const messages = selectedSession ? selectedSession.messages : []
  const chatHeaderDom = getChatHeaderDom(sessions.length)
  const sessionNodes = sessions.flatMap((session) => getSessionDom(session, selectedSessionId))
  const messagesNodes = getMessagesDom(messages)
  const chatDetailsDom = getChatDetailsDom(messagesNodes, composerValue)
  const dom: VirtualDomNode[] = [
    {
      childCount: 3,
      className: ClassNames.Viewlet + ' Chat',
      onClick: DomEventListenerFunctions.HandleClick,
      onInput: DomEventListenerFunctions.HandleInput,
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      type: VirtualDomElements.Div,
    },
    ...chatHeaderDom,
    ...sessionNodes,
    ...chatDetailsDom,
  ]
  return dom
}
