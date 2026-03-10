import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import {
  openApiApiKeyRequiredMessage,
  openApiRequestFailedMessage,
  openApiRequestFailedOfflineMessage,
  openRouterApiKeyRequiredMessage,
  openRouterRequestFailedMessage,
  openRouterTooManyRequestsMessage,
} from '../chatViewStrings/chatViewStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getMessageContentDom } from '../GetMessageContentDom/GetMessageContentDom.ts'
import { getMissingOpenApiApiKeyDom } from '../GetMissingOpenApiApiKeyDom/GetMissingOpenApiApiKeyDom.ts'
import { getMissingOpenRouterApiKeyDom } from '../GetMissingOpenRouterApiKeyDom/GetMissingOpenRouterApiKeyDom.ts'
import { getOpenApiRequestFailedDom } from '../GetOpenApiRequestFailedDom/GetOpenApiRequestFailedDom.ts'
import { getOpenRouterRequestFailedDom } from '../GetOpenRouterRequestFailedDom/GetOpenRouterRequestFailedDom.ts'
import { getOpenRouterTooManyRequestsDom } from '../GetOpenRouterTooManyRequestsDom/GetOpenRouterTooManyRequestsDom.ts'
import { getToolCallsDom } from '../GetToolCallsDom/GetToolCallsDom.ts'
import { parseMessageContent } from '../ParseMessageContent/ParseMessageContent.ts'

export const getChatMessageDom = (
  message: ChatMessage,
  openRouterApiKeyInput: string,
  openApiApiKeyInput = '',
  openRouterApiKeyState: 'idle' | 'saving' = 'idle',
): readonly VirtualDomNode[] => {
  const roleClassName = message.role === 'user' ? ClassNames.MessageUser : ClassNames.MessageAssistant
  const isOpenApiApiKeyMissingMessage = message.role === 'assistant' && message.text === openApiApiKeyRequiredMessage
  const isOpenApiRequestFailedMessage =
    message.role === 'assistant' && (message.text === openApiRequestFailedMessage || message.text === openApiRequestFailedOfflineMessage)
  const isOpenRouterApiKeyMissingMessage = message.role === 'assistant' && message.text === openRouterApiKeyRequiredMessage
  const isOpenRouterRequestFailedMessage = message.role === 'assistant' && message.text === openRouterRequestFailedMessage
  const isOpenRouterTooManyRequestsMessage = message.role === 'assistant' && message.text.startsWith(openRouterTooManyRequestsMessage)
  const messageIntermediate = parseMessageContent(message.text)
  const messageDom = getMessageContentDom(messageIntermediate)
  const toolCallsDom = getToolCallsDom(message)
  const toolCallsChildCount = toolCallsDom.length > 0 ? 1 : 0
  const extraChildCount =
    isOpenApiApiKeyMissingMessage ||
    isOpenApiRequestFailedMessage ||
    isOpenRouterApiKeyMissingMessage ||
    isOpenRouterRequestFailedMessage ||
    isOpenRouterTooManyRequestsMessage
      ? messageIntermediate.length + 1 + toolCallsChildCount
      : messageIntermediate.length + toolCallsChildCount
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
    ...(isOpenApiApiKeyMissingMessage ? getMissingOpenApiApiKeyDom(openApiApiKeyInput) : []),
    ...(isOpenApiRequestFailedMessage ? getOpenApiRequestFailedDom() : []),
    ...(isOpenRouterApiKeyMissingMessage ? getMissingOpenRouterApiKeyDom(openRouterApiKeyInput, openRouterApiKeyState) : []),
    ...(isOpenRouterRequestFailedMessage ? getOpenRouterRequestFailedDom() : []),
    ...(isOpenRouterTooManyRequestsMessage ? getOpenRouterTooManyRequestsDom() : []),
  ]
}
