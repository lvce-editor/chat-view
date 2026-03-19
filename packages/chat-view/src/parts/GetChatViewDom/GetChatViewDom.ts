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

export interface GetChatVirtualDomOptions {
  readonly authEnabled?: boolean
  readonly authErrorMessage?: string
  readonly authStatus?: 'signed-out' | 'signing-in' | 'signed-in'
  readonly chatListScrollTop: number
  readonly composerDropActive?: boolean
  readonly composerDropEnabled?: boolean
  readonly composerFontFamily: string
  readonly composerFontSize: number
  readonly composerHeight: number
  readonly composerLineHeight: number
  readonly composerValue: string
  readonly messagesScrollTop: number
  readonly models: readonly ChatModel[]
  readonly openApiApiKeyInput: string
  readonly openRouterApiKeyInput: string
  readonly openRouterApiKeyState: 'idle' | 'saving'
  readonly parsedMessages?: readonly ParsedMessage[]
  readonly projectExpandedIds?: readonly string[]
  readonly projectListScrollTop?: number
  readonly projects?: readonly Project[]
  readonly selectedModelId: string
  readonly selectedProjectId?: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly tokensMax: number
  readonly tokensUsed: number
  readonly usageOverviewEnabled: boolean
  readonly useChatMathWorker?: boolean
  readonly viewMode: ChatViewMode
  readonly voiceDictationEnabled?: boolean
}

const isGetChatVirtualDomOptions = (value: GetChatVirtualDomOptions | readonly ChatSession[]): value is GetChatVirtualDomOptions => {
  return !Array.isArray(value)
}

export function getChatVirtualDom(options: GetChatVirtualDomOptions): readonly VirtualDomNode[]
export function getChatVirtualDom(
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
  composerDropActive?: boolean,
  composerDropEnabled?: boolean,
  projects?: readonly Project[],
  projectExpandedIds?: readonly string[],
  selectedProjectId?: string,
  projectListScrollTop?: number,
  voiceDictationEnabled?: boolean,
  useChatMathWorker?: boolean,
  parsedMessages?: readonly ParsedMessage[],
  authEnabled?: boolean,
  authStatus?: 'signed-out' | 'signing-in' | 'signed-in',
  authErrorMessage?: string,
): readonly VirtualDomNode[]
export function getChatVirtualDom(
  optionsOrSessions: GetChatVirtualDomOptions | readonly ChatSession[],
  selectedSessionId?: string,
  composerValue?: string,
  openRouterApiKeyInput?: string,
  viewMode?: ChatViewMode,
  models?: readonly ChatModel[],
  selectedModelId?: string,
  usageOverviewEnabled?: boolean,
  tokensUsed?: number,
  tokensMax?: number,
  openApiApiKeyInput?: string,
  openRouterApiKeyState?: 'idle' | 'saving',
  composerHeight?: number,
  composerFontSize?: number,
  composerFontFamily?: string,
  composerLineHeight?: number,
  chatListScrollTop?: number,
  messagesScrollTop?: number,
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
): readonly VirtualDomNode[] {
  const options: GetChatVirtualDomOptions = isGetChatVirtualDomOptions(optionsOrSessions)
    ? optionsOrSessions
    : {
        chatListScrollTop: chatListScrollTop ?? 0,
        composerDropActive,
        composerDropEnabled,
        composerFontFamily: composerFontFamily ?? 'system-ui',
        composerFontSize: composerFontSize ?? 13,
        composerHeight: composerHeight ?? 28,
        composerLineHeight: composerLineHeight ?? 20,
        composerValue: composerValue ?? '',
        messagesScrollTop: messagesScrollTop ?? 0,
        models: models ?? [],
        openApiApiKeyInput: openApiApiKeyInput ?? '',
        openRouterApiKeyInput: openRouterApiKeyInput ?? '',
        openRouterApiKeyState: openRouterApiKeyState ?? 'idle',
        projectExpandedIds,
        projectListScrollTop,
        projects,
        selectedModelId: selectedModelId ?? '',
        selectedProjectId,
        selectedSessionId: selectedSessionId ?? '',
        sessions: optionsOrSessions,
        tokensMax: tokensMax ?? 0,
        tokensUsed: tokensUsed ?? 0,
        usageOverviewEnabled: usageOverviewEnabled ?? false,
        useChatMathWorker,
        viewMode: viewMode ?? 'list',
        voiceDictationEnabled,
        ...(parsedMessages === undefined ? {} : { parsedMessages }),
        authEnabled,
        authErrorMessage,
        authStatus,
      }
  const {
    authEnabled: effectiveAuthEnabled = false,
    authErrorMessage: effectiveAuthErrorMessage = '',
    authStatus: effectiveAuthStatus = 'signed-out',
    chatListScrollTop: effectiveChatListScrollTop,
    composerDropActive: effectiveComposerDropActive = false,
    composerDropEnabled: effectiveComposerDropEnabled = true,
    composerFontFamily: effectiveComposerFontFamily,
    composerFontSize: effectiveComposerFontSize,
    composerHeight: effectiveComposerHeight,
    composerLineHeight: effectiveComposerLineHeight,
    composerValue: effectiveComposerValue,
    messagesScrollTop: effectiveMessagesScrollTop,
    models: effectiveModels,
    openApiApiKeyInput: effectiveOpenApiApiKeyInput,
    openRouterApiKeyInput: effectiveOpenRouterApiKeyInput,
    openRouterApiKeyState: effectiveOpenRouterApiKeyState,
    parsedMessages: effectiveParsedMessagesInput,
    projectExpandedIds: effectiveProjectExpandedIds = [],
    projectListScrollTop: effectiveProjectListScrollTop = 0,
    projects: effectiveProjects = [],
    selectedModelId: effectiveSelectedModelId,
    selectedProjectId: effectiveSelectedProjectId = '',
    selectedSessionId: effectiveSelectedSessionId,
    sessions,
    tokensMax: effectiveTokensMax,
    tokensUsed: effectiveTokensUsed,
    usageOverviewEnabled: effectiveUsageOverviewEnabled,
    useChatMathWorker: effectiveUseChatMathWorker = false,
    viewMode: effectiveViewMode,
    voiceDictationEnabled: effectiveVoiceDictationEnabled = false,
  } = options
  const effectiveParsedMessages = effectiveParsedMessagesInput ?? getFallbackParsedMessages(sessions)
  switch (effectiveViewMode) {
    case 'chat-focus':
      return getChatModeChatFocusVirtualDom({
        authEnabled: effectiveAuthEnabled,
        authErrorMessage: effectiveAuthErrorMessage,
        authStatus: effectiveAuthStatus,
        composerDropActive: effectiveComposerDropActive,
        composerDropEnabled: effectiveComposerDropEnabled,
        composerFontFamily: effectiveComposerFontFamily,
        composerFontSize: effectiveComposerFontSize,
        composerHeight: effectiveComposerHeight,
        composerLineHeight: effectiveComposerLineHeight,
        composerValue: effectiveComposerValue,
        messagesScrollTop: effectiveMessagesScrollTop,
        models: effectiveModels,
        openApiApiKeyInput: effectiveOpenApiApiKeyInput,
        openRouterApiKeyInput: effectiveOpenRouterApiKeyInput,
        openRouterApiKeyState: effectiveOpenRouterApiKeyState,
        parsedMessages: effectiveParsedMessages,
        projectExpandedIds: effectiveProjectExpandedIds,
        projectListScrollTop: effectiveProjectListScrollTop,
        projects: effectiveProjects,
        selectedModelId: effectiveSelectedModelId,
        selectedProjectId: effectiveSelectedProjectId,
        selectedSessionId: effectiveSelectedSessionId,
        sessions,
        tokensMax: effectiveTokensMax,
        tokensUsed: effectiveTokensUsed,
        usageOverviewEnabled: effectiveUsageOverviewEnabled,
        useChatMathWorker: effectiveUseChatMathWorker,
        voiceDictationEnabled: effectiveVoiceDictationEnabled,
      })
    case 'detail':
      return getChatModeDetailVirtualDom({
        authEnabled: effectiveAuthEnabled,
        authErrorMessage: effectiveAuthErrorMessage,
        authStatus: effectiveAuthStatus,
        composerDropActive: effectiveComposerDropActive,
        composerDropEnabled: effectiveComposerDropEnabled,
        composerFontFamily: effectiveComposerFontFamily,
        composerFontSize: effectiveComposerFontSize,
        composerHeight: effectiveComposerHeight,
        composerLineHeight: effectiveComposerLineHeight,
        composerValue: effectiveComposerValue,
        messagesScrollTop: effectiveMessagesScrollTop,
        models: effectiveModels,
        openApiApiKeyInput: effectiveOpenApiApiKeyInput,
        openRouterApiKeyInput: effectiveOpenRouterApiKeyInput,
        openRouterApiKeyState: effectiveOpenRouterApiKeyState,
        parsedMessages: effectiveParsedMessages,
        selectedModelId: effectiveSelectedModelId,
        selectedSessionId: effectiveSelectedSessionId,
        sessions,
        tokensMax: effectiveTokensMax,
        tokensUsed: effectiveTokensUsed,
        usageOverviewEnabled: effectiveUsageOverviewEnabled,
        useChatMathWorker: effectiveUseChatMathWorker,
        voiceDictationEnabled: effectiveVoiceDictationEnabled,
      })
    case 'list':
      return getChatModeListVirtualDom({
        authEnabled: effectiveAuthEnabled,
        authErrorMessage: effectiveAuthErrorMessage,
        authStatus: effectiveAuthStatus,
        chatListScrollTop: effectiveChatListScrollTop,
        composerDropActive: effectiveComposerDropActive,
        composerDropEnabled: effectiveComposerDropEnabled,
        composerFontFamily: effectiveComposerFontFamily,
        composerFontSize: effectiveComposerFontSize,
        composerHeight: effectiveComposerHeight,
        composerLineHeight: effectiveComposerLineHeight,
        composerValue: effectiveComposerValue,
        models: effectiveModels,
        selectedModelId: effectiveSelectedModelId,
        selectedSessionId: effectiveSelectedSessionId,
        sessions,
        tokensMax: effectiveTokensMax,
        tokensUsed: effectiveTokensUsed,
        usageOverviewEnabled: effectiveUsageOverviewEnabled,
        voiceDictationEnabled: effectiveVoiceDictationEnabled,
      })
    default:
      return getChatModeUnsupportedVirtualDom()
  }
}
