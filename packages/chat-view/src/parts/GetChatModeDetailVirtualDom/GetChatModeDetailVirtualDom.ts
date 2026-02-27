import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage, ChatSession } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getChatDetailsDom } from '../GetChatDetailsDom/GetChatDetailsDom.ts'
import { getChatHeaderDomDetailMode } from '../GetChatHeaderDomDetailMode/GetChatHeaderDomDetailMode.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getMessagesDom } from '../GetMessagesDom/GetMessagesDom.ts'

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
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Chat),
      type: VirtualDomElements.Div,
    },
    ...getChatHeaderDomDetailMode(selectedSessionTitle),
    ...getChatDetailsDom(selectedSessionTitle, messagesNodes, composerValue),
  ]
}
