import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetChatMessageDom from '../GetChatMessageDom/GetChatMessageDom.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

export const getMessagesDom = (messages: readonly ChatMessage[], openRouterApiKeyInput: string): readonly VirtualDomNode[] => {
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
      className: 'ChatMessages',
      type: VirtualDomElements.Div,
    },
    ...messages.flatMap((message) => GetChatMessageDom.getChatMessageDom(message, openRouterApiKeyInput)),
  ]
}
