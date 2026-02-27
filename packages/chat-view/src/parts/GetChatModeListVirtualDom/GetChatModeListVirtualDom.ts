import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatContentDom } from '../GetChatViewDom/GetChatContentDom.ts'
import { getChatHeaderActionsDom } from '../GetChatViewDom/GetChatHeaderActionsDom.ts'
import { getChatHeaderDom } from '../GetChatViewDom/GetChatHeaderDom.ts'
import * as Strings from '../GetChatViewDom/GetChatViewDomStrings.ts'
import { getEmptyChatSessionsDom } from '../GetChatViewDom/GetEmptyChatSessionsDom.ts'
import { getSessionDom } from '../GetChatViewDom/GetSessionDom.ts'

export const getChatModeListVirtualDom = (sessions: readonly ChatSession[], selectedSessionId: string): readonly VirtualDomNode[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const selectedSessionTitle = selectedSession?.title || Strings.chatTitle
  const sessionNodes = sessions.flatMap((session) => getSessionDom(session, selectedSessionId))
  const emptyStateNodes = getEmptyChatSessionsDom(sessions.length)
  const contentNodes = getChatContentDom('list', sessions.length, emptyStateNodes, sessionNodes, selectedSessionTitle, [], '')
  return [
    {
      childCount: 2,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Chat),
      onClick: DomEventListenerFunctions.HandleClick,
      onInput: DomEventListenerFunctions.HandleInput,
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      type: VirtualDomElements.Div,
    },
    ...getChatHeaderDom(false, selectedSessionTitle),
    ...getChatHeaderActionsDom(),
    ...contentNodes,
  ]
}
