import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel, ChatSession, Project } from '../ChatState/ChatState.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import { getChatModeChatFocusVirtualDom } from '../GetChatModeChatFocusVirtualDom/GetChatModeChatFocusVirtualDom.ts'
import { getChatModeDetailVirtualDom } from '../GetChatModeDetailVirtualDom/GetChatModeDetailVirtualDom.ts'
import { getChatModeListVirtualDom } from '../GetChatModeListVirtualDom/GetChatModeListVirtualDom.ts'
import { getTodoListItems } from '../GetTodoListItems/GetTodoListItems.ts'
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
  readonly todoListToolEnabled: boolean
  readonly tokensMax: number
  readonly tokensUsed: number
  readonly usageOverviewEnabled: boolean
  readonly useChatMathWorker?: boolean
  readonly viewMode: ChatViewMode
  readonly voiceDictationEnabled?: boolean
}

export const getChatVirtualDom = (options: GetChatVirtualDomOptions): readonly VirtualDomNode[] => {
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
    todoListToolEnabled,
    tokensMax,
    tokensUsed,
    usageOverviewEnabled,
    useChatMathWorker = false,
    viewMode,
    voiceDictationEnabled = false,
  } = options

  const parsedMessages = parsedMessagesInput ?? getFallbackParsedMessages(sessions)
  const todoListItems = getTodoListItems(sessions, selectedSessionId)

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
        todoListItems,
        todoListToolEnabled,
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
        todoListItems,
        todoListToolEnabled,
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
        todoListItems,
        todoListToolEnabled,
        tokensMax,
        tokensUsed,
        usageOverviewEnabled,
        voiceDictationEnabled,
      })
    default:
      return getChatModeUnsupportedVirtualDom()
  }
}
