import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { AuthUserState } from '../AuthUserState/AuthUserState.ts'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
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
import { getChatOverlaysVirtualDom } from '../GetChatOverlaysVirtualDom/GetChatOverlaysVirtualDom.ts'
import { getChatSessionStatus } from '../GetChatSessionStatus/GetChatSessionStatus.ts'
import { getLatestExecutablePlanMessage } from '../GetLatestExecutablePlanMessage/GetLatestExecutablePlanMessage.ts'
import { getMessagesDom } from '../GetMessagesDom/GetMessagesDom.ts'

export interface GetChatModeDetailVirtualDomOptions {
  readonly addContextButtonEnabled: boolean
  readonly agentMode: AgentMode
  readonly agentModePickerOpen?: boolean
  readonly authEnabled?: boolean
  readonly authErrorMessage?: string
  readonly composerAttachmentPreviewOverlayAttachmentId: string
  readonly composerAttachmentPreviewOverlayError?: boolean
  readonly composerAttachments: readonly ComposerAttachment[]
  readonly composerDropActive?: boolean
  readonly composerDropEnabled?: boolean
  readonly composerFontFamily?: string
  readonly composerFontSize?: number
  readonly composerHeight?: number
  readonly composerLineHeight?: number
  readonly composerValue: string
  readonly hasSpaceForAgentModePicker: boolean
  readonly hasSpaceForRunModePicker: boolean
  readonly messagesAutoScrollEnabled: boolean
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
  readonly scrollDownButtonEnabled: boolean
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
  readonly userName?: string
  readonly userState?: AuthUserState
  readonly visibleModels?: readonly ChatModel[]
  readonly voiceDictationEnabled?: boolean
}

export const getChatModeDetailVirtualDom = ({
  addContextButtonEnabled,
  agentMode,
  agentModePickerOpen = false,
  authEnabled = false,
  authErrorMessage = '',
  composerAttachmentPreviewOverlayAttachmentId,
  composerAttachmentPreviewOverlayError = false,
  composerAttachments,
  composerDropActive = false,
  composerDropEnabled = true,
  composerFontFamily = 'system-ui',
  composerFontSize = 13,
  composerHeight = 28,
  composerLineHeight = 20,
  composerValue,
  hasSpaceForAgentModePicker,
  hasSpaceForRunModePicker,
  messagesAutoScrollEnabled,
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
  useChatMathWorker = false,
  userName = '',
  userState = 'loggedOut',
  visibleModels = models,
  voiceDictationEnabled = false,
}: GetChatModeDetailVirtualDomOptions): readonly VirtualDomNode[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const isSelectedSessionInProgress = selectedSession ? getChatSessionStatus(selectedSession) === 'in-progress' : false
  const selectedSessionTitle = selectedSession?.title || Strings.chatTitle()
  const messages: readonly ChatMessage[] = selectedSession ? selectedSession.messages : []
  const showCreatePullRequestButton = canCreatePullRequest(selectedSession)
  const showImplementPlanButton = agentMode === 'plan' && !!getLatestExecutablePlanMessage(selectedSession) && !isSelectedSessionInProgress
  const isDropOverlayVisible = composerDropEnabled && composerDropActive
  const isComposerAttachmentPreviewOverlayVisible = !!composerAttachmentPreviewOverlayAttachmentId
  const isAgentModePickerVisible = hasSpaceForAgentModePicker && agentModePickerOpen
  const isNewModelPickerVisible = modelPickerOpen
  const isRunModePickerVisible = showRunMode && hasSpaceForRunModePicker && runModePickerOpen
  const hasVisibleOverlays =
    isDropOverlayVisible || isComposerAttachmentPreviewOverlayVisible || isAgentModePickerVisible || isNewModelPickerVisible || isRunModePickerVisible
  const chatRootChildCount = 3 + (hasVisibleOverlays ? 1 : 0)
  return [
    {
      childCount: chatRootChildCount,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Chat),
      onDragEnter: DomEventListenerFunctions.HandleDragEnterChatView,
      onDragOver: DomEventListenerFunctions.HandleDragOverChatView,
      type: VirtualDomElements.Div,
    },
    ...getChatHeaderDomDetailMode(selectedSessionTitle, authEnabled, userState, userName, authErrorMessage),
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
      composerAttachments,
      agentMode,
      agentModePickerOpen,
      false,
      false,
      '',
      [],
      '',
      hasSpaceForAgentModePicker,
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
      hasSpaceForRunModePicker,
      runMode,
      runModePickerOpen,
      todoListToolEnabled,
      todoListItems,
      showCreatePullRequestButton,
      showImplementPlanButton,
      voiceDictationEnabled,
      isSelectedSessionInProgress,
      scrollDownButtonEnabled,
      messagesAutoScrollEnabled,
    ),
    ...getChatOverlaysVirtualDom({
      agentMode,
      agentModePickerVisible: isAgentModePickerVisible,
      composerAttachmentPreviewOverlayAttachmentId,
      composerAttachmentPreviewOverlayError,
      composerAttachmentPreviewOverlayVisible: isComposerAttachmentPreviewOverlayVisible,
      composerAttachments,
      dropOverlayVisible: isDropOverlayVisible,
      modelPickerSearchValue,
      modelPickerVisible: isNewModelPickerVisible,
      runMode,
      runModePickerVisible: isRunModePickerVisible,
      selectedModelId,
      visibleModels,
    }),
  ]
}
