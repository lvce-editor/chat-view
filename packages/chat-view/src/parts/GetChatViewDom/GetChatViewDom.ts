import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel, ChatSession } from '../ChatState/ChatState.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import { getChatModeDetailVirtualDom } from '../GetChatModeDetailVirtualDom/GetChatModeDetailVirtualDom.ts'
import { getChatModeListVirtualDom } from '../GetChatModeListVirtualDom/GetChatModeListVirtualDom.ts'
import { getChatModeUnsupportedVirtualDom } from '../GetChatModeUnsupportedVirtualDom/GetChatModeUnsupportedVirtualDom.ts'

export const getChatVirtualDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  composerValue: string,
  viewMode: ChatViewMode,
  models: readonly ChatModel[],
  selectedModelId: string,
  usageOverviewEnabled: boolean,
  tokensUsed: number,
  tokensMax: number,
): readonly VirtualDomNode[] => {
  switch (viewMode) {
    case 'detail':
      return getChatModeDetailVirtualDom(sessions, selectedSessionId, composerValue, models, selectedModelId, usageOverviewEnabled, tokensUsed, tokensMax)
    case 'list':
      return getChatModeListVirtualDom(sessions, selectedSessionId, composerValue, models, selectedModelId, usageOverviewEnabled, tokensUsed, tokensMax)
    default:
      return getChatModeUnsupportedVirtualDom()
  }
}
