import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel, ChatSession, Project } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatSendAreaDom } from '../GetChatDetailsDom/GetChatDetailsDom.ts'
import { getChatHeaderListModeDom } from '../GetChatHeaderDomListMode/GetChatHeaderDomListMode.ts'
import { getChatListDom } from '../GetChatListDom/GetChatListDom.ts'
import { getProjectListDom } from '../GetProjectListDom/GetProjectListDom.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatModeListVirtualDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  composerValue: string,
  models: readonly ChatModel[],
  selectedModelId: string,
  usageOverviewEnabled: boolean,
  tokensUsed: number,
  tokensMax: number,
  composerHeight = 28,
  composerFontSize = 13,
  composerFontFamily = 'system-ui',
  composerLineHeight = 20,
  chatListScrollTop = 0,
  composerDropActive = false,
  composerDropEnabled = true,
  projects: readonly Project[] = [],
  selectedProjectId = '',
  projectListScrollTop = 0,
): readonly VirtualDomNode[] => {
  const isDropOverlayVisible = composerDropEnabled && composerDropActive
  return [
    {
      childCount: 5,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Chat),
      onDragEnter: DomEventListenerFunctions.HandleDragEnterChatView,
      onDragOver: DomEventListenerFunctions.HandleDragOverChatView,
      type: VirtualDomElements.Div,
    },
    ...getChatHeaderListModeDom(),
    ...getProjectListDom(projects, selectedProjectId, projectListScrollTop),
    ...getChatListDom(sessions, selectedSessionId, chatListScrollTop),
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
