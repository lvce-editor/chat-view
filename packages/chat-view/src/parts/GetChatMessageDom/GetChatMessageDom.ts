import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import {
  openApiApiKeyRequiredMessage,
  openRouterApiKeyRequiredMessage,
  openRouterRequestFailedMessage,
  openRouterTooManyRequestsMessage,
} from '../chatViewStrings/chatViewStrings.ts'
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
  openRouterApiKeyState: 'idle' | 'saving' = 'idle',
  useChatMathWorker = false,
): readonly VirtualDomNode[] => {
  const getDirectMessageChildCount = (): number => {
    let count = parsedMessageContent.length
    if (message.role === 'assistant' && message.toolCalls && message.toolCalls.length > 0) {
      count += 1
    }
    if (
      message.role === 'assistant' &&
      (message.text === openApiApiKeyRequiredMessage ||
        message.text === openRouterApiKeyRequiredMessage ||
        message.text === openRouterRequestFailedMessage ||
        message.text.startsWith(openRouterTooManyRequestsMessage))
    ) {
      count += 1
    }
    return count
  }

  const roleClassName = message.role === 'user' ? ClassNames.MessageUser : ClassNames.MessageAssistant
  const isOpenApiApiKeyMissingMessage = message.role === 'assistant' && message.text === openApiApiKeyRequiredMessage
  const isOpenRouterApiKeyMissingMessage = message.role === 'assistant' && message.text === openRouterApiKeyRequiredMessage
  const isOpenRouterRequestFailedMessage = message.role === 'assistant' && message.text === openRouterRequestFailedMessage
  const isOpenRouterTooManyRequestsMessage = message.role === 'assistant' && message.text.startsWith(openRouterTooManyRequestsMessage)
  const messageDom = getMessageContentDom(parsedMessageContent, useChatMathWorker)
  const toolCallsDom = getToolCallsDom(message)
  const directChildCount = getDirectMessageChildCount()
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Message, roleClassName),
      type: VirtualDomElements.Div,
    },
    {
      childCount: directChildCount,
      className: ClassNames.ChatMessageContent,
      type: VirtualDomElements.Div,
    },
    ...toolCallsDom,
    ...messageDom,
    ...(isOpenApiApiKeyMissingMessage ? getMissingOpenApiApiKeyDom() : []),
    ...(isOpenRouterApiKeyMissingMessage ? getMissingOpenRouterApiKeyDom(openRouterApiKeyState) : []),
    ...(isOpenRouterRequestFailedMessage ? getOpenRouterRequestFailedDom() : []),
    ...(isOpenRouterTooManyRequestsMessage ? getOpenRouterTooManyRequestsDom() : []),
  ]
}
