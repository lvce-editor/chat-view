import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getChatDetailsDom } from './GetChatDetailsDom.ts'

export const getChatContentDom = (
  viewMode: ChatViewMode,
  sessionsLength: number,
  emptyStateNodes: readonly VirtualDomNode[],
  sessionNodes: readonly VirtualDomNode[],
  selectedSessionTitle: string,
  messagesNodes: readonly VirtualDomNode[],
  composerValue: string,
): readonly VirtualDomNode[] => {
  if (viewMode === 'list') {
    return [
      {
        childCount: sessionsLength === 0 ? 1 : sessionsLength,
        className: ClassNames.ChatList,
        type: VirtualDomElements.Div,
      },
      ...(sessionsLength === 0 ? emptyStateNodes : sessionNodes),
    ]
  }
  return getChatDetailsDom(selectedSessionTitle, messagesNodes, composerValue)
}
