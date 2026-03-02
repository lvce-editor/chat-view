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
  openRouterApiKeyInput: string,
  viewMode: ChatViewMode,
  models: readonly ChatModel[],
  selectedModelId: string,
  usageOverviewEnabled: boolean,
  tokensUsed: number,
  tokensMax: number,
  openApiApiKeyInput = '',
  openRouterApiKeyState: 'idle' | 'saving' = 'idle',
  composerHeight = 28,
  composerFontSize = 13,
  composerFontFamily = 'system-ui',
  composerLineHeight = 20,
): readonly VirtualDomNode[] => {
  switch (viewMode) {
    case 'detail':
      return getChatModeDetailVirtualDom(
        sessions,
        selectedSessionId,
        composerValue,
        openRouterApiKeyInput,
        openApiApiKeyInput,
        models,
        selectedModelId,
        usageOverviewEnabled,
        tokensUsed,
        tokensMax,
        openRouterApiKeyState,
        composerHeight,
        composerFontSize,
        composerFontFamily,
        composerLineHeight,
      )
    case 'list':
      return getChatModeListVirtualDom(
        sessions,
        selectedSessionId,
        composerValue,
        models,
        selectedModelId,
        usageOverviewEnabled,
        tokensUsed,
        tokensMax,
        composerHeight,
        composerFontSize,
        composerFontFamily,
        composerLineHeight,
      )
    default:
      return getChatModeUnsupportedVirtualDom()
  }
}
