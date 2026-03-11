import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel, ChatSession } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getChatSendAreaDom } from '../GetChatDetailsDom/GetChatDetailsDom.ts'
import { getChatHeaderListModeDom } from '../GetChatHeaderDomListMode/GetChatHeaderDomListMode.ts'
import { getChatListDom } from '../GetChatListDom/GetChatListDom.ts'

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
  composerDropActive = true,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 3,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Chat),
      type: VirtualDomElements.Div,
    },
    ...getChatHeaderListModeDom(),
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
      composerDropActive,
    ),
  ]
}
