import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { AuthUserState } from '../AuthUserState/AuthUserState.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import type { ComposerPrimaryControl } from '../ComposerPrimaryControls/ComposerPrimaryControls.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatSendAreaDom } from '../GetChatDetailsDom/GetChatDetailsDom.ts'
import { getChatHeaderListModeDom } from '../GetChatHeaderDomListMode/GetChatHeaderDomListMode.ts'
import { getChatListDom } from '../GetChatListDom/GetChatListDom.ts'
import { getChatOverlaysVirtualDom } from '../GetChatOverlaysVirtualDom/GetChatOverlaysVirtualDom.ts'

export interface GetChatModeListVirtualDomOptions {
  readonly addContextButtonEnabled: boolean
  readonly agentMode: AgentMode
  readonly agentModePickerOpen?: boolean
  readonly authEnabled?: boolean
  readonly authErrorMessage?: string
  readonly chatListScrollTop?: number
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
  readonly hiddenPrimaryControls?: readonly ComposerPrimaryControl[]
  readonly listFocusedIndex?: number
  readonly listFocusOutline?: boolean
  readonly modelPickerOpen?: boolean
  readonly modelPickerSearchValue?: string
  readonly models: readonly ChatModel[]
  readonly primaryControlsOverflowButtonVisible?: boolean
  readonly reasoningEffort: ReasoningEffort
  readonly reasoningEffortPickerOpen?: boolean
  readonly reasoningPickerEnabled: boolean
  readonly runMode: RunMode
  readonly runModePickerOpen?: boolean
  readonly searchEnabled?: boolean
  readonly searchFieldVisible?: boolean
  readonly searchValue?: string
  readonly selectChevronEnabled: boolean
  readonly selectedModelId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly showChatListTime: boolean
  readonly showModelUsageMultiplier?: boolean
  readonly showRunMode: boolean
  readonly todoListItems: readonly TodoListItem[]
  readonly todoListToolEnabled: boolean
  readonly tokensMax: number
  readonly tokensUsed: number
  readonly usageOverviewEnabled: boolean
  readonly userName?: string
  readonly userState?: AuthUserState
  readonly visibleModels?: readonly ChatModel[]
  readonly visiblePrimaryControls?: readonly ComposerPrimaryControl[]
  readonly voiceDictationEnabled?: boolean
}

export const getChatModeListVirtualDom = ({
  addContextButtonEnabled,
  agentMode,
  agentModePickerOpen = false,
  authEnabled = false,
  authErrorMessage = '',
  chatListScrollTop = 0,
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
  hasSpaceForAgentModePicker: _hasSpaceForAgentModePicker,
  hasSpaceForRunModePicker: _hasSpaceForRunModePicker,
  hiddenPrimaryControls = [],
  listFocusedIndex = -1,
  listFocusOutline = false,
  modelPickerOpen = false,
  modelPickerSearchValue = '',
  models,
  primaryControlsOverflowButtonVisible = false,
  reasoningEffort,
  reasoningEffortPickerOpen = false,
  reasoningPickerEnabled,
  runMode,
  runModePickerOpen = false,
  searchEnabled = false,
  searchFieldVisible = false,
  searchValue = '',
  selectChevronEnabled,
  selectedModelId,
  selectedSessionId,
  sessions,
  showChatListTime,
  showModelUsageMultiplier = true,
  showRunMode,
  todoListItems,
  todoListToolEnabled,
  tokensMax,
  tokensUsed,
  usageOverviewEnabled,
  userName = '',
  userState = 'loggedOut',
  visibleModels = models,
  visiblePrimaryControls = [],
  voiceDictationEnabled = false,
}: GetChatModeListVirtualDomOptions): readonly VirtualDomNode[] => {
  const isDropOverlayVisible = composerDropEnabled && composerDropActive
  const isComposerAttachmentPreviewOverlayVisible = !!composerAttachmentPreviewOverlayAttachmentId
  const isAgentModePickerVisible = agentModePickerOpen
  const isNewModelPickerVisible = modelPickerOpen
  const isRunModePickerVisible = showRunMode && runModePickerOpen
  const hasVisibleOverlays =
    isDropOverlayVisible || isComposerAttachmentPreviewOverlayVisible || isAgentModePickerVisible || isNewModelPickerVisible || isRunModePickerVisible
  const chatRootChildCount = 3 + (hasVisibleOverlays ? 1 : 0)
  const searchValueTrimmed = searchValue.trim().toLowerCase()
  const visibleSessions =
    searchEnabled && searchValueTrimmed ? sessions.filter((session) => session.title.toLowerCase().includes(searchValueTrimmed)) : sessions
  return [
    {
      childCount: chatRootChildCount,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Chat),
      onDragEnter: DomEventListenerFunctions.HandleDragEnterChatView,
      onDragOver: DomEventListenerFunctions.HandleDragOverChatView,
      type: VirtualDomElements.Div,
    },
    ...getChatHeaderListModeDom(authEnabled, userState, userName, authErrorMessage, searchEnabled, searchFieldVisible, searchValue),
    ...getChatListDom(visibleSessions, selectedSessionId, listFocusOutline, listFocusedIndex, showChatListTime, chatListScrollTop),
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
      visiblePrimaryControls,
      hiddenPrimaryControls,
      primaryControlsOverflowButtonVisible,
      selectChevronEnabled,
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
      false,
      false,
      voiceDictationEnabled,
      false,
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
      showModelUsageMultiplier,
      visibleModels,
    }),
  ]
}
