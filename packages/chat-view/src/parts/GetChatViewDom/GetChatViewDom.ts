<<<<<<< HEAD
import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
=======
import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
>>>>>>> origin/main
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import { getChatModeDetailVirtualDom } from '../GetChatModeDetailVirtualDom/GetChatModeDetailVirtualDom.ts'
import { getChatModeListVirtualDom } from '../GetChatModeListVirtualDom/GetChatModeListVirtualDom.ts'
<<<<<<< HEAD
import { getChatModeUnsupportedVirtualDom } from '../GetChatModeUnsupportedVirtualDom/GetChatModeUnsupportedVirtualDom.ts'
=======

const getChatModeUnsupportedVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      type: VirtualDomElements.Div,
    },
    text('Unknown view mode'),
  ]
}
>>>>>>> origin/main

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
<<<<<<< HEAD
      return getChatModeListVirtualDom(sessions, selectedSessionId, composerValue)
=======
      return getChatModeListVirtualDom(sessions, selectedSessionId)
>>>>>>> origin/main
    default:
      return getChatModeUnsupportedVirtualDom()
  }
}
