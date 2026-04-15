import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { AuthUserState } from '../AuthUserState/AuthUserState.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ChatViewMode } from '../ChatViewMode/ChatViewMode.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import type { GitBranch } from '../GitBranch/GitBranch.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type { Project } from '../Project/Project.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import { getChatModeChatFocusVirtualDom } from '../GetChatModeChatFocusVirtualDom/GetChatModeChatFocusVirtualDom.ts'
import { getChatModeDetailVirtualDom } from '../GetChatModeDetailVirtualDom/GetChatModeDetailVirtualDom.ts'
import { getChatModeListVirtualDom } from '../GetChatModeListVirtualDom/GetChatModeListVirtualDom.ts'
import { getChatModeUnsupportedVirtualDom } from '../GetChatModeUnsupportedVirtualDom/GetChatModeUnsupportedVirtualDom.ts'
import { getTodoListItems } from '../GetTodoListItems/GetTodoListItems.ts'
import { getEmptyMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'

const getFallbackParsedMessages = (sessions: readonly ChatSession[]): readonly ParsedMessage[] => {
  const parsedMessages: ParsedMessage[] = []
  for (const session of sessions) {
    for (const message of session.messages) {
      if (parsedMessages.some((item) => item.id === message.id)) {
        continue
      }
      parsedMessages.push({
        id: message.id,
        parsedContent: getEmptyMessageContent(),
        text: message.text,
      })
    }
  }
  return parsedMessages
}

export interface GetChatVirtualDomOptions {
  readonly addContextButtonEnabled: boolean
  readonly agentMode: AgentMode
  readonly agentModePickerOpen?: boolean
  readonly authEnabled?: boolean
  readonly authErrorMessage?: string
  readonly chatListScrollTop: number
  readonly composerAttachmentPreviewOverlayAttachmentId: string
  readonly composerAttachmentPreviewOverlayError?: boolean
  readonly composerAttachments: readonly ComposerAttachment[]
  readonly composerDropActive?: boolean
  readonly composerDropEnabled?: boolean
  readonly composerFontFamily: string
  readonly composerFontSize: number
  readonly composerHeight: number
  readonly composerLineHeight: number
  readonly composerValue: string
  readonly gitBranches?: readonly GitBranch[]
  readonly gitBranchPickerErrorMessage?: string
  readonly gitBranchPickerOpen?: boolean
  readonly gitBranchPickerVisible?: boolean
  readonly hasSpaceForAgentModePicker: boolean
  readonly hasSpaceForRunModePicker: boolean
  readonly listFocusedIndex?: number
  readonly listFocusOutline?: boolean
  readonly messagesAutoScrollEnabled: boolean
  readonly messagesScrollTop: number
  readonly modelPickerOpen?: boolean
  readonly modelPickerSearchValue?: string
  readonly models: readonly ChatModel[]
  readonly openApiApiKeyInput: string
  readonly openApiApiKeyInputPattern: string
  readonly openApiApiKeysSettingsUrl: string
  readonly openApiApiKeyState: 'idle' | 'saving'
  readonly openRouterApiKeyInput: string
  readonly openRouterApiKeyState: 'idle' | 'saving'
  readonly parsedMessages?: readonly ParsedMessage[]
  readonly projectExpandedIds?: readonly string[]
  readonly projectListScrollTop?: number
  readonly projects?: readonly Project[]
  readonly reasoningEffort: ReasoningEffort
  readonly reasoningEffortPickerOpen?: boolean
  readonly reasoningPickerEnabled: boolean
  readonly renderSelectChevrons: boolean
  readonly runMode: RunMode
  readonly runModePickerOpen?: boolean
  readonly scrollDownButtonEnabled: boolean
  readonly searchEnabled?: boolean
  readonly searchFieldVisible?: boolean
  readonly searchValue?: string
  readonly selectedModelId: string
  readonly selectedProjectId?: string
  readonly selectedSessionId: string
  readonly sessionPinningEnabled: boolean
  readonly sessions: readonly ChatSession[]
  readonly showChatListTime: boolean
  readonly showRunMode: boolean
  readonly todoListToolEnabled: boolean
  readonly tokensMax: number
  readonly tokensUsed: number
  readonly usageOverviewEnabled: boolean
  readonly useChatMathWorker?: boolean
  readonly userName?: string
  readonly userState?: AuthUserState
  readonly viewMode: ChatViewMode
  readonly visibleModels?: readonly ChatModel[]
  readonly voiceDictationEnabled?: boolean
}

export const getChatVirtualDom = (options: GetChatVirtualDomOptions): readonly VirtualDomNode[] => {
  const {
    addContextButtonEnabled,
    agentMode,
    agentModePickerOpen = false,
    authEnabled = false,
    authErrorMessage = '',
    chatListScrollTop,
    composerAttachmentPreviewOverlayAttachmentId,
    composerAttachmentPreviewOverlayError = false,
    composerAttachments,
    composerDropActive = false,
    composerDropEnabled = true,
    composerFontFamily,
    composerFontSize,
    composerHeight,
    composerLineHeight,
    composerValue,
    gitBranches = [],
    gitBranchPickerErrorMessage = '',
    gitBranchPickerOpen = false,
    gitBranchPickerVisible = false,
    hasSpaceForAgentModePicker,
    hasSpaceForRunModePicker,
    listFocusedIndex = -1,
    listFocusOutline = false,
    messagesAutoScrollEnabled,
    messagesScrollTop,
    modelPickerOpen = false,
    modelPickerSearchValue = '',
    models,
    openApiApiKeyInput,
    openApiApiKeyInputPattern,
    openApiApiKeysSettingsUrl,
    openApiApiKeyState,
    openRouterApiKeyInput,
    openRouterApiKeyState,
    parsedMessages: parsedMessagesInput,
    projectExpandedIds = [],
    projectListScrollTop = 0,
    projects = [],
    reasoningEffort,
    reasoningEffortPickerOpen = false,
    reasoningPickerEnabled,
    renderSelectChevrons,
    runMode,
    runModePickerOpen = false,
    scrollDownButtonEnabled,
    searchEnabled = false,
    searchFieldVisible = false,
    searchValue = '',
    selectedModelId,
    selectedProjectId = '',
    selectedSessionId,
    sessionPinningEnabled,
    sessions,
    showChatListTime,
    showRunMode,
    todoListToolEnabled,
    tokensMax,
    tokensUsed,
    usageOverviewEnabled,
    useChatMathWorker = false,
    userName = '',
    userState = 'loggedOut',
    viewMode,
    visibleModels = models,
    voiceDictationEnabled = false,
  } = options

  const parsedMessages = parsedMessagesInput ?? getFallbackParsedMessages(sessions)
  const todoListItems = getTodoListItems(sessions, selectedSessionId)

  switch (viewMode) {
    case 'chat-focus':
      return getChatModeChatFocusVirtualDom({
        addContextButtonEnabled,
        agentMode,
        agentModePickerOpen,
        authEnabled,
        authErrorMessage,
        composerAttachmentPreviewOverlayAttachmentId,
        composerAttachmentPreviewOverlayError,
        composerAttachments,
        composerDropActive,
        composerDropEnabled,
        composerFontFamily,
        composerFontSize,
        composerHeight,
        composerLineHeight,
        composerValue,
        gitBranches,
        gitBranchPickerErrorMessage,
        gitBranchPickerOpen,
        gitBranchPickerVisible,
        hasSpaceForAgentModePicker,
        hasSpaceForRunModePicker,
        messagesAutoScrollEnabled,
        messagesScrollTop,
        modelPickerOpen,
        modelPickerSearchValue,
        models,
        openApiApiKeyInput,
        openApiApiKeyInputPattern,
        openApiApiKeysSettingsUrl,
        openApiApiKeyState,
        openRouterApiKeyInput,
        openRouterApiKeyState,
        parsedMessages,
        projectExpandedIds,
        projectListScrollTop,
        projects,
        reasoningEffort,
        reasoningEffortPickerOpen,
        reasoningPickerEnabled,
        renderSelectChevrons,
        runMode,
        runModePickerOpen,
        scrollDownButtonEnabled,
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
        userName,
        userState,
        visibleModels,
        voiceDictationEnabled,
      })
    case 'detail':
      return getChatModeDetailVirtualDom({
        addContextButtonEnabled,
        agentMode,
        agentModePickerOpen,
        authEnabled,
        authErrorMessage,
        composerAttachmentPreviewOverlayAttachmentId,
        composerAttachmentPreviewOverlayError,
        composerAttachments,
        composerDropActive,
        composerDropEnabled,
        composerFontFamily,
        composerFontSize,
        composerHeight,
        composerLineHeight,
        composerValue,
        hasSpaceForAgentModePicker,
        hasSpaceForRunModePicker,
        messagesAutoScrollEnabled,
        messagesScrollTop,
        modelPickerOpen,
        modelPickerSearchValue,
        models,
        openApiApiKeyInput,
        openApiApiKeyInputPattern,
        openApiApiKeysSettingsUrl,
        openApiApiKeyState,
        openRouterApiKeyInput,
        openRouterApiKeyState,
        parsedMessages,
        reasoningEffort,
        reasoningEffortPickerOpen,
        reasoningPickerEnabled,
        renderSelectChevrons,
        runMode,
        runModePickerOpen,
        scrollDownButtonEnabled,
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
        userName,
        userState,
        visibleModels,
        voiceDictationEnabled,
      })
    case 'list':
      return getChatModeListVirtualDom({
        addContextButtonEnabled,
        agentMode,
        agentModePickerOpen,
        authEnabled,
        authErrorMessage,
        chatListScrollTop,
        composerAttachmentPreviewOverlayAttachmentId,
        composerAttachmentPreviewOverlayError,
        composerAttachments,
        composerDropActive,
        composerDropEnabled,
        composerFontFamily,
        composerFontSize,
        composerHeight,
        composerLineHeight,
        composerValue,
        hasSpaceForAgentModePicker,
        hasSpaceForRunModePicker,
        listFocusedIndex,
        listFocusOutline,
        modelPickerOpen,
        modelPickerSearchValue,
        models,
        reasoningEffort,
        reasoningEffortPickerOpen,
        reasoningPickerEnabled,
        renderSelectChevrons,
        runMode,
        runModePickerOpen,
        searchEnabled,
        searchFieldVisible,
        searchValue,
        selectedModelId,
        selectedSessionId,
        sessionPinningEnabled,
        sessions,
        showChatListTime,
        showRunMode,
        todoListItems,
        todoListToolEnabled,
        tokensMax,
        tokensUsed,
        usageOverviewEnabled,
        userName,
        userState,
        visibleModels,
        voiceDictationEnabled,
      })
    default:
      return getChatModeUnsupportedVirtualDom()
  }
}
