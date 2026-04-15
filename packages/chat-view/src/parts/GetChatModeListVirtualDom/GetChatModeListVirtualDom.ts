import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { AuthUserState } from '../AuthUserState/AuthUserState.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatSendAreaDom } from '../GetChatDetailsDom/GetChatDetailsDom.ts'
import { getChatHeaderListModeDom } from '../GetChatHeaderDomListMode/GetChatHeaderDomListMode.ts'
import { getChatListDom } from '../GetChatListDom/GetChatListDom.ts'
import { getChatOverlaysVirtualDom } from '../GetChatOverlaysVirtualDom/GetChatOverlaysVirtualDom.ts'
import { getPinnedSessionsFirst } from '../GetPinnedSessionsFirst/GetPinnedSessionsFirst.ts'

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
  readonly listFocusedIndex?: number
  readonly listFocusOutline?: boolean
  readonly modelPickerOpen?: boolean
  readonly modelPickerSearchValue?: string
  readonly models: readonly ChatModel[]
  readonly reasoningEffort: ReasoningEffort
  readonly reasoningEffortPickerOpen?: boolean
  readonly reasoningPickerEnabled: boolean
  readonly renderSelectChevrons: boolean
  readonly runMode: RunMode
  readonly runModePickerOpen?: boolean
  readonly searchEnabled?: boolean
  readonly searchFieldVisible?: boolean
  readonly searchValue?: string
  readonly selectedModelId: string
  readonly selectedSessionId: string
  readonly sessionPinningEnabled?: boolean
  readonly sessions: readonly ChatSession[]
  readonly showChatListTime: boolean
  readonly showRunMode: boolean
  readonly todoListItems: readonly TodoListItem[]
  readonly todoListToolEnabled: boolean
  readonly tokensMax: number
  readonly tokensUsed: number
  readonly usageOverviewEnabled: boolean
  readonly userName?: string
  readonly userState?: AuthUserState
  readonly visibleModels?: readonly ChatModel[]
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
  hasSpaceForAgentModePicker,
  hasSpaceForRunModePicker,
  listFocusedIndex = -1,
  listFocusOutline = false,
  modelPickerOpen = false,
  modelPickerSearchValue = '',
  models,
  reasoningEffort,
  reasoningEffortPickerOpen = false,
  reasoningPickerEnabled,
  renderSelectChevrons,
  runMode,
  runModePickerOpen = false,
  searchEnabled = false,
  searchFieldVisible = false,
  searchValue = '',
  selectedModelId,
  selectedSessionId,
  sessionPinningEnabled = true,
  sessions,
  showChatListTime,
  showRunMode,
  todoListItems,
  todoListToolEnabled,
  tokensMax,
  tokensUsed,
  usageOverviewEnabled,
  userName = '',
  userState = 'loggedOut',
  visibleModels = models,
  voiceDictationEnabled = false,
}: GetChatModeListVirtualDomOptions): readonly VirtualDomNode[] => {
  const isDropOverlayVisible = composerDropEnabled && composerDropActive
  const isComposerAttachmentPreviewOverlayVisible = !!composerAttachmentPreviewOverlayAttachmentId
  const isAgentModePickerVisible = hasSpaceForAgentModePicker && agentModePickerOpen
  const isNewModelPickerVisible = modelPickerOpen
  const isRunModePickerVisible = showRunMode && hasSpaceForRunModePicker && runModePickerOpen
  const hasVisibleOverlays =
    isDropOverlayVisible || isComposerAttachmentPreviewOverlayVisible || isAgentModePickerVisible || isNewModelPickerVisible || isRunModePickerVisible
  const chatRootChildCount = 3 + (hasVisibleOverlays ? 1 : 0)
  const searchValueTrimmed = searchValue.trim().toLowerCase()
  const filteredSessions =
    searchEnabled && searchValueTrimmed ? sessions.filter((session) => session.title.toLowerCase().includes(searchValueTrimmed)) : sessions
  const visibleSessions = sessionPinningEnabled ? getPinnedSessionsFirst(filteredSessions) : filteredSessions
  return [
    {
      childCount: chatRootChildCount,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Chat),
      onDragEnter: DomEventListenerFunctions.HandleDragEnterChatView,
      onDragOver: DomEventListenerFunctions.HandleDragOverChatView,
      type: VirtualDomElements.Div,
    },
    ...getChatHeaderListModeDom(authEnabled, userState, userName, authErrorMessage, searchEnabled, searchFieldVisible, searchValue),
    ...getChatListDom(
      visibleSessions,
      selectedSessionId,
      listFocusOutline,
      listFocusedIndex,
      showChatListTime,
      sessionPinningEnabled,
      chatListScrollTop,
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
      renderSelectChevrons,
      showRunMode,
      hasSpaceForRunModePicker,
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
      visibleModels,
    }),
  ]
}
