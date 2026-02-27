import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../StatusBarState/StatusBarState.ts'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import { getChatContentDom } from '../GetChatViewDom/GetChatContentDom.ts'
import * as Strings from '../GetChatViewDom/GetChatViewDomStrings.ts'
import { getEmptyChatSessionsDom } from '../GetChatViewDom/GetEmptyChatSessionsDom.ts'
import { getMessagesDom } from '../GetChatViewDom/GetMessagesDom.ts'
import { getSessionDom } from '../GetChatViewDom/GetSessionDom.ts'

export const getChatModeListVirtualDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
): readonly VirtualDomNode[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const selectedSessionTitle = selectedSession?.title || Strings.chatTitle
  const sessionNodes = sessions.flatMap((session) => getSessionDom(session, selectedSessionId))
  const emptyStateNodes = getEmptyChatSessionsDom(sessions.length)
  return getChatContentDom('list', sessions.length, emptyStateNodes, sessionNodes, selectedSessionTitle, [], '')
}

export const getChatModeDetailVirtualDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  composerValue: string,
): readonly VirtualDomNode[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const selectedSessionTitle = selectedSession?.title || Strings.chatTitle
  const messages: readonly ChatMessage[] = selectedSession ? selectedSession.messages : []
  const messagesNodes = getMessagesDom(messages)
  return getChatContentDom('detail', sessions.length, [], [], selectedSessionTitle, messagesNodes, composerValue)
}
