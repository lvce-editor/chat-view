import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel, ChatSession, Project } from '../ChatState/ChatState.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
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
  readonly runMode: RunMode
  readonly selectedModelId: string
  readonly selectedProjectId?: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly showRunMode: boolean
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

type SharedPositionalTail = [
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
]

type LegacyPositionalArgs = [
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
  ...tail: SharedPositionalTail,
]

type RunModePositionalArgs = [
  selectedSessionId: string,
  composerValue: string,
  openRouterApiKeyInput: string,
  viewMode: ChatViewMode,
  models: readonly ChatModel[],
  selectedModelId: string,
  usageOverviewEnabled: boolean,
  showRunMode: boolean,
  runMode: RunMode,
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
  ...tail: SharedPositionalTail,
]

const fromLegacyPositionalArgs = (sessions: readonly ChatSession[], args: LegacyPositionalArgs): GetChatVirtualDomOptions => {
  const [
    selectedSessionId,
    composerValue,
    openRouterApiKeyInput,
    viewMode,
    models,
    selectedModelId,
    usageOverviewEnabled,
    tokensUsed,
    tokensMax,
    openApiApiKeyInput,
    openRouterApiKeyState,
    composerHeight,
    composerFontSize,
    composerFontFamily,
    composerLineHeight,
    chatListScrollTop,
    messagesScrollTop,
    composerDropActive = false,
    composerDropEnabled = true,
    projects = [],
    projectExpandedIds = [],
    selectedProjectId = '',
    projectListScrollTop = 0,
    voiceDictationEnabled = false,
    useChatMathWorker = false,
    parsedMessages,
    authEnabled = false,
    authStatus = 'signed-out',
    authErrorMessage = '',
  ] = args
  return {
    authEnabled,
    authErrorMessage,
    authStatus,
    chatListScrollTop,
    composerDropActive,
    composerDropEnabled,
    composerFontFamily,
    composerFontSize,
    composerHeight,
    composerLineHeight,
    composerValue,
    messagesScrollTop,
    models,
    openApiApiKeyInput,
    openRouterApiKeyInput,
    openRouterApiKeyState,
    ...(parsedMessages === undefined ? {} : { parsedMessages }),
    projectExpandedIds,
    projectListScrollTop,
    projects,
    runMode: 'local',
    selectedModelId,
    selectedProjectId,
    selectedSessionId,
    sessions,
    showRunMode: false,
    tokensMax,
    tokensUsed,
    usageOverviewEnabled,
    useChatMathWorker,
    viewMode,
    voiceDictationEnabled,
  }
}

const fromRunModePositionalArgs = (sessions: readonly ChatSession[], args: RunModePositionalArgs): GetChatVirtualDomOptions => {
  const [
    selectedSessionId,
    composerValue,
    openRouterApiKeyInput,
    viewMode,
    models,
    selectedModelId,
    usageOverviewEnabled,
    showRunMode,
    runMode,
    tokensUsed,
    tokensMax,
    openApiApiKeyInput,
    openRouterApiKeyState,
    composerHeight,
    composerFontSize,
    composerFontFamily,
    composerLineHeight,
    chatListScrollTop,
    messagesScrollTop,
    composerDropActive = false,
    composerDropEnabled = true,
    projects = [],
    projectExpandedIds = [],
    selectedProjectId = '',
    projectListScrollTop = 0,
    voiceDictationEnabled = false,
    useChatMathWorker = false,
    parsedMessages,
    authEnabled = false,
    authStatus = 'signed-out',
    authErrorMessage = '',
  ] = args
  return {
    authEnabled,
    authErrorMessage,
    authStatus,
    chatListScrollTop,
    composerDropActive,
    composerDropEnabled,
    composerFontFamily,
    composerFontSize,
    composerHeight,
    composerLineHeight,
    composerValue,
    messagesScrollTop,
    models,
    openApiApiKeyInput,
    openRouterApiKeyInput,
    openRouterApiKeyState,
    ...(parsedMessages === undefined ? {} : { parsedMessages }),
    projectExpandedIds,
    projectListScrollTop,
    projects,
    runMode,
    selectedModelId,
    selectedProjectId,
    selectedSessionId,
    sessions,
    showRunMode,
    tokensMax,
    tokensUsed,
    usageOverviewEnabled,
    useChatMathWorker,
    viewMode,
    voiceDictationEnabled,
  }
}

export function getChatVirtualDom(options: GetChatVirtualDomOptions): readonly VirtualDomNode[]
export function getChatVirtualDom(sessions: readonly ChatSession[], ...args: LegacyPositionalArgs): readonly VirtualDomNode[]
export function getChatVirtualDom(sessions: readonly ChatSession[], ...args: RunModePositionalArgs): readonly VirtualDomNode[]
export function getChatVirtualDom(
  optionsOrSessions: GetChatVirtualDomOptions | readonly ChatSession[],
  ...args: LegacyPositionalArgs | RunModePositionalArgs
): readonly VirtualDomNode[] {
  const options = isGetChatVirtualDomOptions(optionsOrSessions)
    ? optionsOrSessions
    : typeof args[7] === 'boolean' && typeof args[8] === 'string'
      ? fromRunModePositionalArgs(optionsOrSessions, args as RunModePositionalArgs)
      : fromLegacyPositionalArgs(optionsOrSessions, args as LegacyPositionalArgs)

  const {
    authEnabled = false,
    authErrorMessage = '',
    authStatus = 'signed-out',
    chatListScrollTop,
    composerDropActive = false,
    composerDropEnabled = true,
    composerFontFamily,
    composerFontSize,
    composerHeight,
    composerLineHeight,
    composerValue,
    messagesScrollTop,
    models,
    openApiApiKeyInput,
    openRouterApiKeyInput,
    openRouterApiKeyState,
    parsedMessages: parsedMessagesInput,
    projectExpandedIds = [],
    projectListScrollTop = 0,
    projects = [],
    runMode,
    selectedModelId,
    selectedProjectId = '',
    selectedSessionId,
    sessions,
    showRunMode,
    tokensMax,
    tokensUsed,
    usageOverviewEnabled,
    useChatMathWorker = false,
    viewMode,
    voiceDictationEnabled = false,
  } = options

  const parsedMessages = parsedMessagesInput ?? getFallbackParsedMessages(sessions)

  switch (viewMode) {
    case 'chat-focus':
      return getChatModeChatFocusVirtualDom({
        authEnabled,
        authErrorMessage,
        authStatus,
        composerDropActive,
        composerDropEnabled,
        composerFontFamily,
        composerFontSize,
        composerHeight,
        composerLineHeight,
        composerValue,
        messagesScrollTop,
        models,
        openApiApiKeyInput,
        openRouterApiKeyInput,
        openRouterApiKeyState,
        parsedMessages,
        projectExpandedIds,
        projectListScrollTop,
        projects,
        runMode,
        selectedModelId,
        selectedProjectId,
        selectedSessionId,
        sessions,
        showRunMode,
        tokensMax,
        tokensUsed,
        usageOverviewEnabled,
        useChatMathWorker,
        voiceDictationEnabled,
      })
    case 'detail':
      return getChatModeDetailVirtualDom({
        authEnabled,
        authErrorMessage,
        authStatus,
        composerDropActive,
        composerDropEnabled,
        composerFontFamily,
        composerFontSize,
        composerHeight,
        composerLineHeight,
        composerValue,
        messagesScrollTop,
        models,
        openApiApiKeyInput,
        openRouterApiKeyInput,
        openRouterApiKeyState,
        parsedMessages,
        runMode,
        selectedModelId,
        selectedSessionId,
        sessions,
        showRunMode,
        tokensMax,
        tokensUsed,
        usageOverviewEnabled,
        useChatMathWorker,
        voiceDictationEnabled,
      })
    case 'list':
      return getChatModeListVirtualDom({
        authEnabled,
        authErrorMessage,
        authStatus,
        chatListScrollTop,
        composerDropActive,
        composerDropEnabled,
        composerFontFamily,
        composerFontSize,
        composerHeight,
        composerLineHeight,
        composerValue,
        models,
        runMode,
        selectedModelId,
        selectedSessionId,
        sessions,
        showRunMode,
        tokensMax,
        tokensUsed,
        usageOverviewEnabled,
        voiceDictationEnabled,
      })
    default:
      return getChatModeUnsupportedVirtualDom()
  }
}
