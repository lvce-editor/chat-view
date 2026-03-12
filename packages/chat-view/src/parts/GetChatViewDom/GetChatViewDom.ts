import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel, ChatSession, Project } from '../ChatState/ChatState.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import { getChatModeChatFocusVirtualDom } from '../GetChatModeChatFocusVirtualDom/GetChatModeChatFocusVirtualDom.ts'
import { getChatModeDetailVirtualDom } from '../GetChatModeDetailVirtualDom/GetChatModeDetailVirtualDom.ts'
import { getChatModeListVirtualDom } from '../GetChatModeListVirtualDom/GetChatModeListVirtualDom.ts'
import { getChatModeUnsupportedVirtualDom } from '../GetChatModeUnsupportedVirtualDom/GetChatModeUnsupportedVirtualDom.ts'
import { getVisibleSessions } from '../GetVisibleSessions/GetVisibleSessions.ts'

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
  openApiApiKeyInput: string,
  openRouterApiKeyState: 'idle' | 'saving',
  composerHeight: number,
  composerFontSize: number,
  composerFontFamily: string,
  composerLineHeight: number,
  chatListScrollTop: number,
  messagesScrollTop: number,
  composerDropActive = false,
  composerDropEnabled = true,
  projects: readonly Project[] = [],
  selectedProjectId = '',
  projectListScrollTop = 0,
): readonly VirtualDomNode[] => {
  const visibleSessions = getVisibleSessions(sessions, selectedProjectId)
  switch (viewMode) {
    case 'detail':
      return getChatModeDetailVirtualDom(
        visibleSessions,
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
        messagesScrollTop,
        composerDropActive,
        composerDropEnabled,
      )
    case 'list':
      return getChatModeListVirtualDom(
        visibleSessions,
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
        chatListScrollTop,
        composerDropActive,
        composerDropEnabled,
      )
    case 'chat-focus':
      return getChatModeChatFocusVirtualDom(
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
        messagesScrollTop,
        composerDropActive,
        composerDropEnabled,
        projects,
        selectedProjectId,
        projectListScrollTop,
      )
    default:
      return getChatModeUnsupportedVirtualDom()
  }
}
