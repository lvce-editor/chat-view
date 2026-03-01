import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getChatMessageDom = (message: ChatMessage): readonly VirtualDomNode[] => {
  const roleClassName = message.role === 'user' ? ClassNames.MessageUser : ClassNames.MessageAssistant
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Message, roleClassName),
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatMessageContent,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.Markdown,
      type: VirtualDomElements.P,
    },
    text(message.text),
  ]
}
