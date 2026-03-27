import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ChatSession } from '../ChatSession/ChatSession.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getAgentModePickerPopOverVirtualDom } from '../GetAgentModePickerPopOverVirtualDom/GetAgentModePickerPopOverVirtualDom.ts'
import { getChatSendAreaDom } from '../GetChatDetailsDom/GetChatDetailsDom.ts'
import { getChatHeaderListModeDom } from '../GetChatHeaderDomListMode/GetChatHeaderDomListMode.ts'
import { getChatListDom } from '../GetChatListDom/GetChatListDom.ts'
import { getChatModelPickerPopOverVirtualDom } from '../GetChatModelPickerPopOverVirtualDom/GetChatModelPickerPopOverVirtualDom.ts'
import { getRunModePickerPopOverVirtualDom } from '../GetRunModePickerPopOverVirtualDom/GetRunModePickerPopOverVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'

export interface GetChatModeListVirtualDomOptions {
  readonly addContextButtonEnabled: boolean
  readonly agentMode: AgentMode
  readonly agentModePickerOpen?: boolean
  readonly authEnabled?: boolean
  readonly authErrorMessage?: string
  readonly authStatus?: 'signed-out' | 'signing-in' | 'signed-in'
  readonly chatListScrollTop?: number
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
  readonly modelPickerOpen?: boolean
  readonly modelPickerSearchValue?: string
  readonly models: readonly ChatModel[]
  readonly reasoningEffort: ReasoningEffort
  readonly reasoningEffortPickerOpen?: boolean
  readonly reasoningPickerEnabled: boolean
  readonly runMode: RunMode
  readonly runModePickerOpen?: boolean
  readonly searchEnabled?: boolean
  readonly searchFieldVisible?: boolean
  readonly searchValue?: string
  readonly selectedModelId: string
  readonly selectedSessionId: string
  readonly sessions: readonly ChatSession[]
  readonly showRunMode: boolean
  readonly todoListItems: readonly TodoListItem[]
  readonly todoListToolEnabled: boolean
  readonly tokensMax: number
  readonly tokensUsed: number
  readonly usageOverviewEnabled: boolean
  readonly visibleModels?: readonly ChatModel[]
  readonly voiceDictationEnabled?: boolean
}

const getDropOverlayVirtualDom = (isDropOverlayVisible: boolean): readonly VirtualDomNode[] => {
  if (!isDropOverlayVisible) {
    return []
  }
  return [
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
}

export const getChatModeListVirtualDom = ({
  addContextButtonEnabled,
  agentMode,
  agentModePickerOpen = false,
  authEnabled = false,
  authErrorMessage = '',
  authStatus = 'signed-out',
  chatListScrollTop = 0,
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
  modelPickerOpen = false,
  modelPickerSearchValue = '',
  models,
  reasoningEffort,
  reasoningEffortPickerOpen = false,
  reasoningPickerEnabled,
  runMode,
  runModePickerOpen = false,
  searchEnabled = false,
  searchFieldVisible = false,
  searchValue = '',
  selectedModelId,
  selectedSessionId,
  sessions,
  showRunMode,
  todoListItems,
  todoListToolEnabled,
  tokensMax,
  tokensUsed,
  usageOverviewEnabled,
  visibleModels = models,
  voiceDictationEnabled = false,
}: GetChatModeListVirtualDomOptions): readonly VirtualDomNode[] => {
  const isDropOverlayVisible = composerDropEnabled && composerDropActive
  const isAgentModePickerVisible = hasSpaceForAgentModePicker && agentModePickerOpen
  const isNewModelPickerVisible = modelPickerOpen
  const isRunModePickerVisible = showRunMode && hasSpaceForRunModePicker && runModePickerOpen
  const chatRootChildCount =
    3 + (isDropOverlayVisible ? 1 : 0) + (isAgentModePickerVisible ? 1 : 0) + (isNewModelPickerVisible ? 1 : 0) + (isRunModePickerVisible ? 1 : 0)
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
    ...getChatHeaderListModeDom(authEnabled, authStatus, authErrorMessage, searchEnabled, searchFieldVisible, searchValue),
    ...getChatListDom(visibleSessions, selectedSessionId, listFocusedIndex, chatListScrollTop),
    ...getChatSendAreaDom(
      composerValue,
      composerAttachments,
      agentMode,
      agentModePickerOpen,
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
      false,
      voiceDictationEnabled,
    ),
    ...getDropOverlayVirtualDom(isDropOverlayVisible),
    ...(isAgentModePickerVisible ? getAgentModePickerPopOverVirtualDom(agentMode) : []),
    ...(isNewModelPickerVisible ? getChatModelPickerPopOverVirtualDom(visibleModels, selectedModelId, modelPickerSearchValue) : []),
    ...(isRunModePickerVisible ? getRunModePickerPopOverVirtualDom(runMode) : []),
  ]
}
