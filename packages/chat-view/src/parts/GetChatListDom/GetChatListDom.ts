import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatSession } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getSessionDom } from '../GetSessionDom/GetSessionDom.ts'

export const getChatListDom = (sessions: readonly ChatSession[], selectedSessionId: string): readonly VirtualDomNode[] => {
  if (sessions.length === 0) {
    return [
      {
        childCount: 1,
        className: ClassNames.Label,
        type: VirtualDomElements.Div,
      },
      text(Strings.clickToOpenNewChat),
    ]
  }
  return [
    {
      childCount: sessions.length,
      className: ClassNames.ChatList,
      type: VirtualDomElements.Div,
    },
    ...sessions.flatMap(getSessionDom),
  ]
}
