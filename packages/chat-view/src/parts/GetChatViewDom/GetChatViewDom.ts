import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel, ChatSession, Project } from '../ChatState/ChatState.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import { getChatModeChatFocusVirtualDom } from '../GetChatModeChatFocusVirtualDom/GetChatModeChatFocusVirtualDom.ts'
import { getChatModeDetailVirtualDom } from '../GetChatModeDetailVirtualDom/GetChatModeDetailVirtualDom.ts'
import { getChatModeListVirtualDom } from '../GetChatModeListVirtualDom/GetChatModeListVirtualDom.ts'
import { getChatModeUnsupportedVirtualDom } from '../GetChatModeUnsupportedVirtualDom/GetChatModeUnsupportedVirtualDom.ts'
import { parseMessageContent } from '../ParseMessageContent/ParseMessageContent.ts'

const getParsedMessagesFallback = (sessions: readonly ChatSession[], selectedSessionId: string): readonly (readonly MessageIntermediateNode[])[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  if (!selectedSession) {
    return []
  }
  return selectedSession.messages.map((message) => parseMessageContent(message.text))
}

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
  projectExpandedIds: readonly string[] = [],
  selectedProjectId = '',
  projectListScrollTop = 0,
  voiceDictationEnabled = false,
  useChatMathWorker = false,
  parsedMessages: readonly (readonly MessageIntermediateNode[])[] = [],
): readonly VirtualDomNode[] => {
  const parsedMessagesForRender = parsedMessages.length > 0 ? parsedMessages : getParsedMessagesFallback(sessions, selectedSessionId)
  switch (viewMode) {
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
        projectExpandedIds,
        selectedProjectId,
        projectListScrollTop,
        voiceDictationEnabled,
        useChatMathWorker,
        parsedMessagesForRender,
      )
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
        messagesScrollTop,
        composerDropActive,
        composerDropEnabled,
        voiceDictationEnabled,
        useChatMathWorker,
        parsedMessagesForRender,
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
        chatListScrollTop,
        composerDropActive,
        composerDropEnabled,
        voiceDictationEnabled,
      )
    default:
      return getChatModeUnsupportedVirtualDom()
  }
}
