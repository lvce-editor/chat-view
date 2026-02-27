import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import { getChatModeDetailVirtualDom } from '../GetChatModeDetailVirtualDom/GetChatModeDetailVirtualDom.ts'
import { getChatModeListVirtualDom } from '../GetChatModeListVirtualDom/GetChatModeListVirtualDom.ts'

const getChatModeUnsupportedVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      type: VirtualDomElements.Div,
    },
    text('Unknown view mode'),
  ]
}

export const getChatVirtualDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  composerValue: string,
  viewMode: ChatViewMode,
): readonly VirtualDomNode[] => {
  switch (viewMode) {
    case 'detail':
      return getChatModeDetailVirtualDom(sessions, selectedSessionId, composerValue)
    case 'list':
      return getChatModeListVirtualDom(sessions, selectedSessionId)
    default:
      return getChatModeUnsupportedVirtualDom()
  }
}
