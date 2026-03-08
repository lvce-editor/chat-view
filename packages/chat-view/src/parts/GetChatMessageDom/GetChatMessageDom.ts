<<<<<<< HEAD
import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
=======
import { type VirtualDomNode, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
>>>>>>> origin/main
import type { ChatMessage } from '../ChatState/ChatState.ts'
import {
  openApiApiKeyRequiredMessage,
  openRouterApiKeyRequiredMessage,
  openRouterRequestFailedMessage,
  openRouterTooManyRequestsMessage,
} from '../chatViewStrings/chatViewStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getMissingOpenApiApiKeyDom } from '../GetMissingOpenApiApiKeyDom/GetMissingOpenApiApiKeyDom.ts'
import { getMissingOpenRouterApiKeyDom } from '../GetMissingOpenRouterApiKeyDom/GetMissingOpenRouterApiKeyDom.ts'
import { getOpenRouterRequestFailedDom } from '../GetOpenRouterRequestFailedDom/GetOpenRouterRequestFailedDom.ts'
import { getOpenRouterTooManyRequestsDom } from '../GetOpenRouterTooManyRequestsDom/GetOpenRouterTooManyRequestsDom.ts'
<<<<<<< HEAD
import { getToolCallsDom } from '../GetToolCallsDom/GetToolCallsDom.ts'
import { getMessageContentDom, parseMessageContent } from '../ParseMessageContent/ParseMessageContent.ts'

=======
import { getToolCallArgumentPreview } from '../GetToolCallArgumentPreview/GetToolCallArgumentPreview.ts'
import { getMessageContentDom, parseMessageContent } from '../ParseMessageContent/ParseMessageContent.ts'

const getToolCallsDom = (message: ChatMessage): readonly VirtualDomNode[] => {
  if (message.role !== 'assistant' || !message.toolCalls || message.toolCalls.length === 0) {
    return []
  }
  return message.toolCalls.flatMap((toolCall) => {
    const argumentPreview = getToolCallArgumentPreview(toolCall.arguments)
    const label = `${toolCall.name} ${argumentPreview}`
    return [
      {
        childCount: 1,
        className: ClassNames.Markdown,
        type: VirtualDomElements.P,
      },
      text(label),
    ]
  })
}

>>>>>>> origin/main
export const getChatMessageDom = (
  message: ChatMessage,
  openRouterApiKeyInput: string,
  openApiApiKeyInput = '',
  openRouterApiKeyState: 'idle' | 'saving' = 'idle',
): readonly VirtualDomNode[] => {
  const roleClassName = message.role === 'user' ? ClassNames.MessageUser : ClassNames.MessageAssistant
  const isOpenApiApiKeyMissingMessage = message.role === 'assistant' && message.text === openApiApiKeyRequiredMessage
  const isOpenRouterApiKeyMissingMessage = message.role === 'assistant' && message.text === openRouterApiKeyRequiredMessage
  const isOpenRouterRequestFailedMessage = message.role === 'assistant' && message.text === openRouterRequestFailedMessage
  const isOpenRouterTooManyRequestsMessage = message.role === 'assistant' && message.text.startsWith(openRouterTooManyRequestsMessage)
  const messageIntermediate = parseMessageContent(message.text)
  const messageDom = getMessageContentDom(messageIntermediate)
  const toolCallsDom = getToolCallsDom(message)
  const toolCallsDomCount = toolCallsDom.length > 0 ? 1 : 0
  const extraChildCount =
    isOpenApiApiKeyMissingMessage || isOpenRouterApiKeyMissingMessage || isOpenRouterRequestFailedMessage || isOpenRouterTooManyRequestsMessage
      ? 1
      : 0
  const childCount = messageDom.length + extraChildCount + toolCallsDomCount
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Message, roleClassName),
      type: VirtualDomElements.Div,
    },
    {
      childCount,
      className: ClassNames.ChatMessageContent,
      type: VirtualDomElements.Div,
    },
    ...messageDom,
    ...toolCallsDom,
    ...(isOpenApiApiKeyMissingMessage ? getMissingOpenApiApiKeyDom(openApiApiKeyInput) : []),
    ...(isOpenRouterApiKeyMissingMessage ? getMissingOpenRouterApiKeyDom(openRouterApiKeyInput, openRouterApiKeyState) : []),
    ...(isOpenRouterRequestFailedMessage ? getOpenRouterRequestFailedDom() : []),
    ...(isOpenRouterTooManyRequestsMessage ? getOpenRouterTooManyRequestsDom() : []),
  ]
}
