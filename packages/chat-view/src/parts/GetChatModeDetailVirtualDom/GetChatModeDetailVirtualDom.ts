import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import { canCreatePullRequest } from '../CanCreatePullRequest/CanCreatePullRequest.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatSendAreaDom } from '../GetChatDetailsDom/GetChatDetailsDom.ts'
import { getChatHeaderDomDetailMode } from '../GetChatHeaderDomDetailMode/GetChatHeaderDomDetailMode.ts'
import { getChatModelPickerPopOverVirtualDom } from '../GetChatModelPickerPopOverVirtualDom/GetChatModelPickerPopOverVirtualDom.ts'
import { getMessagesDom } from '../GetMessagesDom/GetMessagesDom.ts'
import { getRunModePickerPopOverVirtualDom } from '../GetRunModePickerPopOverVirtualDom/GetRunModePickerPopOverVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

export interface GetChatModeDetailVirtualDomOptions {
  readonly addContextButtonEnabled: boolean
  readonly authEnabled?: boolean
  readonly authErrorMessage?: string
  readonly authStatus?: 'signed-out' | 'signing-in' | 'signed-in'
  readonly composerDropActive?: boolean
  readonly composerDropEnabled?: boolean
  readonly composerFontFamily?: string
  readonly composerFontSize?: number
  readonly composerHeight?: number
  readonly composerLineHeight?: number
  readonly composerValue: string
  readonly messagesScrollTop?: number
  readonly modelPickerOpen?: boolean
  readonly modelPickerSearchValue?: string
  readonly models: readonly ChatModel[]
  readonly openApiApiKeyInput: string
  readonly openApiApiKeyInputPattern?: string
  readonly openApiApiKeysSettingsUrl?: string
  readonly openApiApiKeyState?: 'idle' | 'saving'
  readonly openRouterApiKeyInput: string
  readonly openRouterApiKeyState?: 'idle' | 'saving'
  readonly parsedMessages?: readonly ParsedMessage[]
  readonly reasoningEffort: ReasoningEffort
  readonly reasoningEffortPickerOpen?: boolean
  readonly reasoningPickerEnabled: boolean
  readonly runMode: RunMode
  readonly runModePickerOpen?: boolean
  readonly selectedModelId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly showRunMode: boolean
  readonly todoListItems: readonly TodoListItem[]
  readonly todoListToolEnabled: boolean
  readonly tokensMax: number
  readonly tokensUsed: number
  readonly usageOverviewEnabled: boolean
  readonly useChatMathWorker?: boolean
  readonly visibleModels?: readonly ChatModel[]
  readonly voiceDictationEnabled?: boolean
}

export const getChatModeDetailVirtualDom = ({
  addContextButtonEnabled,
  authEnabled = false,
  authErrorMessage = '',
  authStatus = 'signed-out',
  composerDropActive = false,
  composerDropEnabled = true,
  composerFontFamily = 'system-ui',
  composerFontSize = 13,
  composerHeight = 28,
  composerLineHeight = 20,
  composerValue,
  messagesScrollTop = 0,
  modelPickerOpen = false,
  modelPickerSearchValue = '',
  models,
  openApiApiKeyInput,
  openApiApiKeyInputPattern = '^sk-.+',
  openApiApiKeysSettingsUrl = 'https://platform.openai.com/api-keys',
  openApiApiKeyState = 'idle',
  openRouterApiKeyInput,
  openRouterApiKeyState = 'idle',
  parsedMessages = [],
  reasoningEffort,
  reasoningEffortPickerOpen = false,
  reasoningPickerEnabled,
  runMode,
  runModePickerOpen = false,
  selectedModelId,
  selectedSessionId,
  sessions,
  showRunMode,
  todoListItems,
  todoListToolEnabled,
  tokensMax,
  tokensUsed,
  usageOverviewEnabled,
  useChatMathWorker = false,
  visibleModels = models,
  voiceDictationEnabled = false,
}: GetChatModeDetailVirtualDomOptions): readonly VirtualDomNode[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const selectedSessionTitle = selectedSession?.title || Strings.chatTitle()
  const messages: readonly ChatMessage[] = selectedSession ? selectedSession.messages : []
  const showCreatePullRequestButton = canCreatePullRequest(selectedSession)
  const isDropOverlayVisible = composerDropEnabled && composerDropActive
  const isNewModelPickerVisible = modelPickerOpen
  const isRunModePickerVisible = showRunMode && runModePickerOpen
  const chatRootChildCount = 3 + (isDropOverlayVisible ? 1 : 0) + (isNewModelPickerVisible ? 1 : 0) + (isRunModePickerVisible ? 1 : 0)
  return [
    {
      childCount: chatRootChildCount,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Chat),
      onDragEnter: DomEventListenerFunctions.HandleDragEnterChatView,
      onDragOver: DomEventListenerFunctions.HandleDragOverChatView,
      type: VirtualDomElements.Div,
    },
    ...getChatHeaderDomDetailMode(selectedSessionTitle, authEnabled, authStatus, authErrorMessage),
    ...getMessagesDom(
      messages,
      parsedMessages,
      openRouterApiKeyInput,
      openApiApiKeyInput,
      openApiApiKeyState,
      openApiApiKeysSettingsUrl,
      openApiApiKeyInputPattern,
      openRouterApiKeyState,
      messagesScrollTop,
      useChatMathWorker,
    ),
    ...getChatSendAreaDom(
      composerValue,
      modelPickerOpen,
      models,
      selectedModelId,
      reasoningPickerEnabled,
      reasoningEffort,
      reasoningEffortPickerOpen,
      usageOverviewEnabled,
      tokensUsed,
      tokensMax,
      addContextButtonEnabled,
      showRunMode,
      runMode,
      runModePickerOpen,
      todoListToolEnabled,
      todoListItems,
      showCreatePullRequestButton,
      voiceDictationEnabled,
    ),
    ...(isDropOverlayVisible
      ? [
          {
            childCount: 1,
            className: mergeClassNames(ClassNames.ChatViewDropOverlay, ClassNames.ChatViewDropOverlayActive),
            name: InputName.ComposerDropTarget,
            onDragLeave: DomEventListenerFunctions.HandleDragLeave,
            onDragOver: DomEventListenerFunctions.HandleDragOver,
            onDrop: DomEventListenerFunctions.HandleDrop,
            type: VirtualDomElements.Div,
          },
          {
            text: Strings.attachImageAsContext(),
            type: VirtualDomElements.Text,
          },
        ]
      : []),
    ...(isNewModelPickerVisible ? getChatModelPickerPopOverVirtualDom(visibleModels, selectedModelId, modelPickerSearchValue) : []),
    ...(isRunModePickerVisible ? getRunModePickerPopOverVirtualDom(runMode) : []),
  ]
}
