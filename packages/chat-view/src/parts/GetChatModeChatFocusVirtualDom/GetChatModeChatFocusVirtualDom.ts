import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage, ChatModel, ChatSession, Project } from '../ChatState/ChatState.ts'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatSendAreaDom } from '../GetChatDetailsDom/GetChatDetailsDom.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getMessagesDom } from '../GetMessagesDom/GetMessagesDom.ts'
import { getProjectListDom } from '../GetProjectListDom/GetProjectListDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatModeChatFocusVirtualDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  composerValue: string,
  openRouterApiKeyInput: string,
  openApiApiKeyInput: string,
  models: readonly ChatModel[],
  selectedModelId: string,
  usageOverviewEnabled: boolean,
  tokensUsed: number,
  tokensMax: number,
  openRouterApiKeyState: 'idle' | 'saving' = 'idle',
  composerHeight = 28,
  composerFontSize = 13,
  composerFontFamily = 'system-ui',
  composerLineHeight = 20,
  messagesScrollTop = 0,
  composerDropActive = false,
  composerDropEnabled = true,
  projects: readonly Project[] = [],
  projectExpandedIds: readonly string[] = [],
  selectedProjectId = '',
  projectListScrollTop = 0,
  voiceDictationEnabled = false,
  useChatMathWorker = false,
  parsedMessages: readonly (readonly MessageIntermediateNode[])[] = [],
): readonly VirtualDomNode[] => {
  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const selectedSessionTitle = selectedSession?.title || Strings.chatTitle()
  const messages: readonly ChatMessage[] = selectedSession ? selectedSession.messages : []
  const isDropOverlayVisible = composerDropEnabled && composerDropActive
  return [
    {
      childCount: 5,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Chat, 'ChatFocus'),
      onDragEnter: DomEventListenerFunctions.HandleDragEnterChatView,
      onDragOver: DomEventListenerFunctions.HandleDragOverChatView,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatHeader,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.Label,
      type: VirtualDomElements.Span,
    },
    {
      text: selectedSessionTitle,
      type: VirtualDomElements.Text,
    },
    ...getProjectListDom(projects, sessions, projectExpandedIds, selectedProjectId, selectedSessionId, projectListScrollTop),
    ...getMessagesDom(
      messages,
      openRouterApiKeyInput,
      openApiApiKeyInput,
      openRouterApiKeyState,
      messagesScrollTop,
      useChatMathWorker,
      parsedMessages,
    ),
    ...getChatSendAreaDom(
      composerValue,
      models,
      selectedModelId,
      usageOverviewEnabled,
      tokensUsed,
      tokensMax,
      composerHeight,
      composerFontSize,
      composerFontFamily,
      composerLineHeight,
      voiceDictationEnabled,
    ),
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.ChatViewDropOverlay, isDropOverlayVisible ? ClassNames.ChatViewDropOverlayActive : ClassNames.Empty),
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
