import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel, ChatSession, Project } from '../ChatState/ChatState.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import { getChatModeChatFocusVirtualDom } from '../GetChatModeChatFocusVirtualDom/GetChatModeChatFocusVirtualDom.ts'
import { getChatModeDetailVirtualDom } from '../GetChatModeDetailVirtualDom/GetChatModeDetailVirtualDom.ts'
import { getChatModeListVirtualDom } from '../GetChatModeListVirtualDom/GetChatModeListVirtualDom.ts'
import { getChatModeUnsupportedVirtualDom } from '../GetChatModeUnsupportedVirtualDom/GetChatModeUnsupportedVirtualDom.ts'
import { getTodoListItems } from '../GetTodoListItems/GetTodoListItems.ts'
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
  readonly addContextButtonEnabled: boolean
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
  readonly listFocusedIndex?: number
  readonly messagesScrollTop: number
  readonly modelPickerOpen?: boolean
  readonly modelPickerSearchValue?: string
  readonly models: readonly ChatModel[]
  readonly openApiApiKeyInput: string
  readonly openApiApiKeyState: 'idle' | 'saving'
  readonly openRouterApiKeyInput: string
  readonly openRouterApiKeyState: 'idle' | 'saving'
  readonly parsedMessages?: readonly ParsedMessage[]
  readonly projectExpandedIds?: readonly string[]
  readonly projectListScrollTop?: number
  readonly projects?: readonly Project[]
  readonly runMode: RunMode
  readonly searchEnabled?: boolean
  readonly searchFieldVisible?: boolean
  readonly searchValue?: string
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
    addContextButtonEnabled,
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
    listFocusedIndex = -1,
    messagesScrollTop,
    modelPickerOpen = false,
    modelPickerSearchValue = '',
    models,
    openApiApiKeyInput,
    openApiApiKeyState,
    openRouterApiKeyInput,
    openRouterApiKeyState,
    parsedMessages: parsedMessagesInput,
    projectExpandedIds = [],
    projectListScrollTop = 0,
    projects = [],
    runMode,
    searchEnabled = false,
    searchFieldVisible = false,
    searchValue = '',
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
        addContextButtonEnabled,
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
        modelPickerOpen,
        modelPickerSearchValue,
        models,
        openApiApiKeyInput,
        openApiApiKeyState,
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
        addContextButtonEnabled,
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
        modelPickerOpen,
        modelPickerSearchValue,
        models,
        openApiApiKeyInput,
        openApiApiKeyState,
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
        addContextButtonEnabled,
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
        listFocusedIndex,
        modelPickerOpen,
        modelPickerSearchValue,
        models,
        runMode,
        searchEnabled,
        searchFieldVisible,
        searchValue,
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
