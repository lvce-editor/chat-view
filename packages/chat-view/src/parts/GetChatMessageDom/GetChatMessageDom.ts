import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import {
  openApiApiKeyRequiredMessage,
  openRouterApiKeyRequiredMessage,
  openRouterRequestFailedMessage,
  openRouterTooManyRequestsMessage,
} from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getMessageContentDom } from '../GetMessageContentDom/GetMessageContentDom.ts'
import { getMissingOpenApiApiKeyDom } from '../GetMissingOpenApiApiKeyDom/GetMissingOpenApiApiKeyDom.ts'
import { getMissingOpenRouterApiKeyDom } from '../GetMissingOpenRouterApiKeyDom/GetMissingOpenRouterApiKeyDom.ts'
import { getOpenRouterRequestFailedDom } from '../GetOpenRouterRequestFailedDom/GetOpenRouterRequestFailedDom.ts'
import { getOpenRouterTooManyRequestsDom } from '../GetOpenRouterTooManyRequestsDom/GetOpenRouterTooManyRequestsDom.ts'
import { getToolCallsDom } from '../GetToolCallsDom/GetToolCallsDom.ts'

export const getChatMessageDom = (
  message: ChatMessage,
  parsedMessageContent: readonly MessageIntermediateNode[],
  _openRouterApiKeyInput: string,
  _openApiApiKeyInput = '',
  openApiApiKeyState: 'idle' | 'saving' = 'idle',
  openRouterApiKeyState: 'idle' | 'saving' = 'idle',
  useChatMathWorker = false,
): readonly VirtualDomNode[] => {
  const roleClassName = message.role === 'user' ? ClassNames.MessageUser : ClassNames.MessageAssistant
  const isOpenApiApiKeyMissingMessage = message.role === 'assistant' && message.text === openApiApiKeyRequiredMessage
  const isOpenRouterApiKeyMissingMessage = message.role === 'assistant' && message.text === openRouterApiKeyRequiredMessage
  const isOpenRouterRequestFailedMessage = message.role === 'assistant' && message.text === openRouterRequestFailedMessage
  const isOpenRouterTooManyRequestsMessage = message.role === 'assistant' && message.text.startsWith(openRouterTooManyRequestsMessage)
  const messageDom = getMessageContentDom(parsedMessageContent, useChatMathWorker)
  const toolCallsDom = getToolCallsDom(message)
  const toolCallsChildCount = toolCallsDom.length > 0 ? 1 : 0
  const messageDomChildCount = messageDom.filter((node) => node.type !== VirtualDomElements.Text).length
  const extraChildCount =
    isOpenApiApiKeyMissingMessage || isOpenRouterApiKeyMissingMessage || isOpenRouterRequestFailedMessage || isOpenRouterTooManyRequestsMessage
      ? messageDomChildCount + 1 + toolCallsChildCount
      : messageDomChildCount + toolCallsChildCount
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
    ...toolCallsDom,
    ...messageDom,
    ...(isOpenApiApiKeyMissingMessage ? getMissingOpenApiApiKeyDom(openApiApiKeyState) : []),
    ...(isOpenRouterApiKeyMissingMessage ? getMissingOpenRouterApiKeyDom(openRouterApiKeyState) : []),
    ...(isOpenRouterRequestFailedMessage ? getOpenRouterRequestFailedDom() : []),
    ...(isOpenRouterTooManyRequestsMessage ? getOpenRouterTooManyRequestsDom() : []),
  ]
}
