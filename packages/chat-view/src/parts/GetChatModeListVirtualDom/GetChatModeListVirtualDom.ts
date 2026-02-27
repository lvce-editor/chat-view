import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getChatSendAreaDom } from '../GetChatDetailsDom/GetChatDetailsDom.ts'
import { getChatHeaderListModeDom } from '../GetChatHeaderDomListMode/GetChatHeaderDomListMode.ts'
import { getChatListDom } from '../GetChatListDom/GetChatListDom.ts'

export const getChatModeListVirtualDom = (
  sessions: readonly ChatSession[],
  selectedSessionId: string,
  composerValue: string,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 3,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.Chat),
      type: VirtualDomElements.Div,
    },
    ...getChatHeaderListModeDom(),
    ...getChatListDom(sessions, selectedSessionId),
    ...getChatSendAreaDom(composerValue),
  ]
}
