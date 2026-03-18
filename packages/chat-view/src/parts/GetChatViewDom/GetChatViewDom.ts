import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel, ChatSession, Project } from '../ChatState/ChatState.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import { getChatModeChatFocusVirtualDom } from '../GetChatModeChatFocusVirtualDom/GetChatModeChatFocusVirtualDom.ts'
import { getChatModeDetailVirtualDom } from '../GetChatModeDetailVirtualDom/GetChatModeDetailVirtualDom.ts'
import { getChatModeListVirtualDom } from '../GetChatModeListVirtualDom/GetChatModeListVirtualDom.ts'
import { getChatModeUnsupportedVirtualDom } from '../GetChatModeUnsupportedVirtualDom/GetChatModeUnsupportedVirtualDom.ts'
import { getEmptyMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'
import { parseMessageContent } from '../ParseMessageContent/ParseMessageContent.ts'

const getFallbackParsedMessages = (sessions: readonly ChatSession[]): readonly ParsedMessage[] => {
  const parsedMessages: ParsedMessage[] = []
  for (const session of sessions) {
    for (const message of session.messages) {
      if (parsedMessages.some((item) => item.id === message.id)) {
        continue
      }
      parsedMessages.push({
        id: message.id,
        parsedContent: message.text === '' ? getEmptyMessageContent() : parseMessageContent(message.text),
        text: message.text,
      })
    }
  }
  return parsedMessages
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
  parsedMessages?: readonly ParsedMessage[],
  authEnabled = false,
  authStatus: 'signed-out' | 'signing-in' | 'signed-in' = 'signed-out',
  authErrorMessage = '',
): readonly VirtualDomNode[] => {
  const effectiveParsedMessages = parsedMessages || getFallbackParsedMessages(sessions)
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
        effectiveParsedMessages,
        authEnabled,
        authStatus,
        authErrorMessage,
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
        effectiveParsedMessages,
        authEnabled,
        authStatus,
        authErrorMessage,
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
        authEnabled,
        authStatus,
        authErrorMessage,
      )
    default:
      return getChatModeUnsupportedVirtualDom()
  }
}
