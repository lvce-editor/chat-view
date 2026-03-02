import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import { openRouterApiKeyRequiredMessage, openRouterRequestFailedMessage, openRouterRequestFailureReasons } from '../chatViewStrings/chatViewStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getMissingOpenRouterApiKeyDom } from '../GetMissingOpenRouterApiKeyDom/GetMissingOpenRouterApiKeyDom.ts'

const getOpenRouterRequestFailedDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: openRouterRequestFailureReasons.length,
      className: ClassNames.Markdown,
      type: VirtualDomElements.Ol,
    },
    ...openRouterRequestFailureReasons.flatMap((reason) => {
      return [
        {
          childCount: 1,
          type: VirtualDomElements.Li,
        },
        text(reason),
      ]
    }),
  ]
}

export const getChatMessageDom = (message: ChatMessage, openRouterApiKeyInput: string): readonly VirtualDomNode[] => {
  const roleClassName = message.role === 'user' ? ClassNames.MessageUser : ClassNames.MessageAssistant
  const isOpenRouterApiKeyMissingMessage = message.role === 'assistant' && message.text === openRouterApiKeyRequiredMessage
  const isOpenRouterRequestFailedMessage = message.role === 'assistant' && message.text === openRouterRequestFailedMessage
  const extraChildCount = isOpenRouterApiKeyMissingMessage || isOpenRouterRequestFailedMessage ? 2 : 1
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Message, roleClassName),
      type: VirtualDomElements.Div,
    },
    {
      childCount: extraChildCount,
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
    ...(isOpenRouterRequestFailedMessage ? getOpenRouterRequestFailedDom() : []),
  ]
}
