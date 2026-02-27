import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatHeaderDomDetailMode } from '../GetChatHeaderDomDetailMode/GetChatHeaderDomDetailMode.ts'
import { getChatDetailsDom } from '../GetChatViewDom/GetChatDetailsDom.ts'
import * as Strings from '../GetChatViewDom/GetChatViewDomStrings.ts'
import { getMessagesDom } from '../GetChatViewDom/GetMessagesDom.ts'
import type { ChatMessage, ChatSession } from '../StatusBarState/StatusBarState.ts'

export const getChatModeDetailVirtualDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  composerValue: string,
): readonly VirtualDomNode[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const selectedSessionTitle = selectedSession?.title || Strings.chatTitle
  const messages: readonly ChatMessage[] = selectedSession ? selectedSession.messages : []
  const messagesNodes = getMessagesDom(messages)
  return [
    {
      childCount: 2,
      className: ClassNames.Viewlet + ' Chat',
      onClick: DomEventListenerFunctions.HandleClick,
      onInput: DomEventListenerFunctions.HandleInput,
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      type: VirtualDomElements.Div,
    },
    ...getChatHeaderDomDetailMode(selectedSessionTitle),
    ...getChatDetailsDom(selectedSessionTitle, messagesNodes, composerValue),
  ]
}
