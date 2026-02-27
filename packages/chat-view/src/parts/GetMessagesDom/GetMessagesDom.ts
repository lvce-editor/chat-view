import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../StatusBarState/StatusBarState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

export const getChatMessageDom = (message: ChatMessage): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: ClassNames.Message,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.Label,
      type: VirtualDomElements.Div,
    },
    text(`${message.role === 'user' ? Strings.you : Strings.assistant} · ${message.time}`),
    {
      childCount: 1,
      className: ClassNames.Markdown,
      type: VirtualDomElements.P,
    },
    text(message.text),
  ]
}

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
  return messages.flatMap((message) => {
    return getChatMessageDom(message)
  })
}
