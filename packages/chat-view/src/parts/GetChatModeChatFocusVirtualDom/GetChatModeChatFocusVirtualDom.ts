import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage, ChatModel, ChatSession, Project } from '../ChatState/ChatState.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatSendAreaDom } from '../GetChatDetailsDom/GetChatDetailsDom.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getMessagesDom } from '../GetMessagesDom/GetMessagesDom.ts'
import { getProjectListDom } from '../GetProjectListDom/GetProjectListDom.ts'
import * as InputName from '../InputName/InputName.ts'

export interface GetChatModeChatFocusVirtualDomOptions {
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
  readonly models: readonly ChatModel[]
  readonly openApiApiKeyInput: string
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
  readonly tokensMax: number
  readonly tokensUsed: number
  readonly usageOverviewEnabled: boolean
  readonly useChatMathWorker?: boolean
  readonly voiceDictationEnabled?: boolean
}

export const getChatModeChatFocusVirtualDom = ({
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
  models,
  openApiApiKeyInput,
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
  return [
    {
      childCount: isDropOverlayVisible ? 4 : 3,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Chat, 'ChatFocus'),
      onDragEnter: DomEventListenerFunctions.HandleDragEnterChatView,
      onDragOver: DomEventListenerFunctions.HandleDragOverChatView,
      type: VirtualDomElements.Div,
    },
    ...getProjectListDom(projects, sessions, projectExpandedIds, selectedProjectId, selectedSessionId, projectListScrollTop),
    ...getMessagesDom(
      messages,
      parsedMessages,
      openRouterApiKeyInput,
      openApiApiKeyInput,
      openRouterApiKeyState,
      messagesScrollTop,
      useChatMathWorker,
      true,
    ),
    ...getChatSendAreaDom(
      composerValue,
      models,
      selectedModelId,
      usageOverviewEnabled,
      tokensUsed,
      tokensMax,
      showRunMode,
      runMode,
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
  ]
}
