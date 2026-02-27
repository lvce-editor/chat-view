import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import { getChatModeDetailVirtualDom } from '../GetChatModeDetailVirtualDom/GetChatModeDetailVirtualDom.ts'
import { getChatModeListVirtualDom } from '../GetChatModeListVirtualDom/GetChatModeListVirtualDom.ts'

export const getChatVirtualDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  composerValue: string,
  viewMode: ChatViewMode,
): readonly VirtualDomNode[] => {
  if (viewMode === 'detail') {
    return getChatModeDetailVirtualDom(sessions, selectedSessionId, composerValue)
  }
  return getChatModeListVirtualDom(sessions, selectedSessionId)
}
