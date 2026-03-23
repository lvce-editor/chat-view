import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage, ChatModel, ChatSession, Project } from '../ChatState/ChatState.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatSendAreaDom } from '../GetChatDetailsDom/GetChatDetailsDom.ts'
import { getChatModelPickerPopOverVirtualDom } from '../GetChatModelPickerPopOverVirtualDom/GetChatModelPickerPopOverVirtualDom.ts'
import { getMessagesDom } from '../GetMessagesDom/GetMessagesDom.ts'
import { getProjectListDom } from '../GetProjectListDom/GetProjectListDom.ts'
import * as InputName from '../InputName/InputName.ts'

export interface GetChatModeChatFocusVirtualDomOptions {
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
  readonly openApiApiKeyState?: 'idle' | 'saving'
  readonly openRouterApiKeyInput: string
  readonly openRouterApiKeyState?: 'idle' | 'saving'
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
  readonly todoListItems: readonly TodoListItem[]
  readonly todoListToolEnabled: boolean
  readonly tokensMax: number
  readonly tokensUsed: number
  readonly usageOverviewEnabled: boolean
  readonly useChatMathWorker?: boolean
  readonly voiceDictationEnabled?: boolean
}

export const getChatModeChatFocusVirtualDom = ({
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
  openApiApiKeyState = 'idle',
  openRouterApiKeyInput,
  openRouterApiKeyState = 'idle',
  parsedMessages = [],
  projectExpandedIds = [],
  projectListScrollTop = 0,
  projects = [],
  runMode,
  selectedModelId,
  selectedProjectId = '',
  selectedSessionId,
  sessions,
  showRunMode,
  todoListItems,
  todoListToolEnabled,
  tokensMax,
  tokensUsed,
  usageOverviewEnabled,
  useChatMathWorker = false,
  voiceDictationEnabled = false,
}: GetChatModeChatFocusVirtualDomOptions): readonly VirtualDomNode[] => {
  void authEnabled
  void authStatus
  void authErrorMessage
  void composerHeight
  void composerFontSize
  void composerFontFamily
  void composerLineHeight
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const messages: readonly ChatMessage[] = selectedSession ? selectedSession.messages : []
  const isDropOverlayVisible = composerDropEnabled && composerDropActive
  const isNewModelPickerVisible = modelPickerOpen
  const chatRootChildCount = 3 + (isDropOverlayVisible ? 1 : 0) + (isNewModelPickerVisible ? 1 : 0)
  return [
    {
      childCount: chatRootChildCount,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Chat, 'ChatFocus'),
      onDragEnter: DomEventListenerFunctions.HandleDragEnterChatView,
      onDragOver: DomEventListenerFunctions.HandleDragOverChatView,
      type: VirtualDomElements.Div,
    },
    ...getProjectListDom(projects, sessions, projectExpandedIds, selectedProjectId, selectedSessionId, projectListScrollTop, true),
    ...getMessagesDom(
      messages,
      parsedMessages,
      openRouterApiKeyInput,
      openApiApiKeyInput,
      openApiApiKeyState,
      openRouterApiKeyState,
      messagesScrollTop,
      useChatMathWorker,
      true,
    ),
    ...getChatSendAreaDom(
      composerValue,
      modelPickerOpen,
      models,
      selectedModelId,
      usageOverviewEnabled,
      tokensUsed,
      tokensMax,
      addContextButtonEnabled,
      showRunMode,
      runMode,
      todoListToolEnabled,
      todoListItems,
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
    ...(isNewModelPickerVisible ? getChatModelPickerPopOverVirtualDom(models, selectedModelId, modelPickerSearchValue) : []),
  ]
}
