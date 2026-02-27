import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import { getChatModeDetailVirtualDom, getChatModeListVirtualDom } from '../GetChatModeVirtualDom/GetChatModeVirtualDom.ts'

export const getChatVirtualDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  composerValue: string,
  viewMode: ChatViewMode,
): readonly VirtualDomNode[] =>
  viewMode === 'detail'
    ? getChatModeDetailVirtualDom(sessions, selectedSessionId, composerValue)
    : getChatModeListVirtualDom(sessions, selectedSessionId)
