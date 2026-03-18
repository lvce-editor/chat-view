import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel, ChatSession } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatSendAreaDom } from '../GetChatDetailsDom/GetChatDetailsDom.ts'
import { getChatHeaderListModeDom } from '../GetChatHeaderDomListMode/GetChatHeaderDomListMode.ts'
import { getChatListDom } from '../GetChatListDom/GetChatListDom.ts'
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
  voiceDictationEnabled = false,
  authEnabled = false,
  authStatus: 'signed-out' | 'signing-in' | 'signed-in' = 'signed-out',
  authErrorMessage = '',
): readonly VirtualDomNode[] => {
  const isDropOverlayVisible = composerDropEnabled && composerDropActive
  return [
    {
      childCount: isDropOverlayVisible ? 4 : 3,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Chat),
      onDragEnter: DomEventListenerFunctions.HandleDragEnterChatView,
      onDragOver: DomEventListenerFunctions.HandleDragOverChatView,
      type: VirtualDomElements.Div,
    },
    ...getChatHeaderListModeDom(authEnabled, authStatus, authErrorMessage),
    ...getChatListDom(sessions, selectedSessionId, chatListScrollTop),
    ...getChatSendAreaDom(composerValue, models, selectedModelId, usageOverviewEnabled, tokensUsed, tokensMax, voiceDictationEnabled),
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
