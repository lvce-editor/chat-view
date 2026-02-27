import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import * as GetChatMessageDom from '../GetChatMessageDom/GetChatMessageDom.ts'

export const getMessagesDom = (messages: readonly ChatMessage[]): readonly VirtualDomNode[] => {
  if (messages.length === 0) {
    return [
      {
        childCount: 1,
        className: ClassNames.ChatWelcomeMessage,
        type: VirtualDomElements.Div,
      },
      text(Strings.startConversation),
    ]
  }
  return [
    {
      childCount: messages.length,
      className: ClassNames.ChatDetailsContent,
      type: VirtualDomElements.Div,
    },
    ...messages.flatMap(GetChatMessageDom.getChatMessageDom),
  ]
}
