import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import { openRouterApiKeyRequiredMessage } from '../chatViewStrings/chatViewStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getMissingOpenRouterApiKeyDom } from '../GetMissingOpenRouterApiKeyDom/GetMissingOpenRouterApiKeyDom.ts'

export const getChatMessageDom = (message: ChatMessage, openRouterApiKeyInput: string): readonly VirtualDomNode[] => {
  const roleClassName = message.role === 'user' ? ClassNames.MessageUser : ClassNames.MessageAssistant
  const isOpenRouterApiKeyMissingMessage = message.role === 'assistant' && message.text === openRouterApiKeyRequiredMessage
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Message, roleClassName),
      type: VirtualDomElements.Div,
    },
    {
      childCount: isOpenRouterApiKeyMissingMessage ? 3 : 1,
      className: ClassNames.ChatMessageContent,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.Markdown,
      type: VirtualDomElements.P,
    },
    text(message.text),
    ...(isOpenRouterApiKeyMissingMessage ? getMissingOpenRouterApiKeyDom(openRouterApiKeyInput) : []),
  ]
}
