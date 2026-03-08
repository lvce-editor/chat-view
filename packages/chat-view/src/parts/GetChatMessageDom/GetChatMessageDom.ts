import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import {
  openApiApiKeyRequiredMessage,
  openRouterApiKeyRequiredMessage,
  openRouterRequestFailedMessage,
  openRouterRequestFailureReasons,
  openRouterTooManyRequestsMessage,
  openRouterTooManyRequestsReasons,
} from '../chatViewStrings/chatViewStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getMissingOpenApiApiKeyDom } from '../GetMissingOpenApiApiKeyDom/GetMissingOpenApiApiKeyDom.ts'
import { getMissingOpenRouterApiKeyDom } from '../GetMissingOpenRouterApiKeyDom/GetMissingOpenRouterApiKeyDom.ts'
import { getMessageContentDom, parseMessageContent } from '../ParseMessageContent/ParseMessageContent.ts'

const getToolCallArgumentPreview = (rawArguments: string): string => {
  if (!rawArguments.trim()) {
    return '""'
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(rawArguments) as unknown
  } catch {
    return rawArguments
  }
  if (!parsed || typeof parsed !== 'object') {
    return rawArguments
  }
  const path = Reflect.get(parsed, 'path')
  if (typeof path === 'string') {
    return `"${path}"`
  }
  const keys = Object.keys(parsed)
  if (keys.length === 1) {
    const value = Reflect.get(parsed, keys[0])
    if (typeof value === 'string') {
      return `"${value}"`
    }
  }
  return rawArguments
}

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

const getOpenRouterRequestFailedDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: openRouterRequestFailureReasons.length,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    ...openRouterRequestFailureReasons.flatMap((reason) => {
      return [
        {
          childCount: 1,
          className: ClassNames.ChatOrderedListItem,
          type: VirtualDomElements.Li,
        },
        text(reason),
      ]
    }),
  ]
}

const getOpenRouterTooManyRequestsDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: openRouterTooManyRequestsReasons.length,
      className: ClassNames.ChatOrderedList,
      type: VirtualDomElements.Ol,
    },
    ...openRouterTooManyRequestsReasons.flatMap((reason) => {
      return [
        {
          childCount: 1,
          className: ClassNames.ChatOrderedListItem,
          type: VirtualDomElements.Li,
        },
        text(reason),
      ]
    }),
  ]
}

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
  const extraChildCount =
    isOpenApiApiKeyMissingMessage || isOpenRouterApiKeyMissingMessage || isOpenRouterRequestFailedMessage || isOpenRouterTooManyRequestsMessage
      ? messageIntermediate.length + 1 + toolCallsDom.length
      : messageIntermediate.length + toolCallsDom.length
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
    ...messageDom,
    ...toolCallsDom,
    ...(isOpenApiApiKeyMissingMessage ? getMissingOpenApiApiKeyDom(openApiApiKeyInput) : []),
    ...(isOpenRouterApiKeyMissingMessage ? getMissingOpenRouterApiKeyDom(openRouterApiKeyInput, openRouterApiKeyState) : []),
    ...(isOpenRouterRequestFailedMessage ? getOpenRouterRequestFailedDom() : []),
    ...(isOpenRouterTooManyRequestsMessage ? getOpenRouterTooManyRequestsDom() : []),
  ]
}
