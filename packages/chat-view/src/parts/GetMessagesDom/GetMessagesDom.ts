import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage, ChatQueuedMessage } from '../ChatState/ChatState.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetChatMessageDom from '../GetChatMessageDom/GetChatMessageDom.ts'
import * as GetEmptyMessagesDom from '../GetEmptyMessagesDom/GetEmptyMessagesDom.ts'
import { getEmptyMessageContent, getParsedMessageContent } from '../ParsedMessageContent/ParsedMessageContent.ts'

interface DisplayMessage {
  readonly message: ChatMessage
  readonly parsedContent: readonly MessageIntermediateNode[]
}

const hasMessageText = (message: ChatMessage): boolean => {
  return message.text.trim().length > 0
}

const getDisplayMessages = (messages: readonly ChatMessage[], parsedMessages: readonly ParsedMessage[]): readonly DisplayMessage[] => {
  const displayMessages: DisplayMessage[] = []
  for (const message of messages) {
    const parsedContent = getParsedMessageContent(parsedMessages, message.id)
    if (!parsedContent) {
      continue
    }
    if (message.role !== 'assistant' || !message.toolCalls || message.toolCalls.length === 0) {
      displayMessages.push({ message, parsedContent })
      continue
    }
    const toolCallMessage: ChatMessage = {
      ...message,
      text: '',
    }
    displayMessages.push({
      message: toolCallMessage,
      parsedContent: getEmptyMessageContent(),
    })
    if (hasMessageText(message)) {
      const { toolCalls: _toolCalls, ...messageWithoutToolCalls } = message
      const textMessage: ChatMessage = {
        ...messageWithoutToolCalls,
      }
      displayMessages.push({
        message: textMessage,
        parsedContent,
      })
    }
  }
  return displayMessages
}

export const getMessagesDom = (
  messages: readonly ChatMessage[],
  parsedMessages: readonly ParsedMessage[],
  queuedMessages: readonly ChatQueuedMessage[] = [],
  openRouterApiKeyInput: string,
  openApiApiKeyInput = '',
  openRouterApiKeyState: 'idle' | 'saving' = 'idle',
  messagesScrollTop = 0,
  useChatMathWorker = false,
): readonly VirtualDomNode[] => {
  if (messages.length === 0 && queuedMessages.length === 0) {
    return GetEmptyMessagesDom.getEmptyMessagesDom()
  }
  const displayMessages = getDisplayMessages([...messages, ...queuedMessages], parsedMessages)
  return [
    {
      childCount: displayMessages.length,
      className: 'ChatMessages',
      onContextMenu: DomEventListenerFunctions.HandleMessagesContextMenu,
      onScroll: DomEventListenerFunctions.HandleMessagesScroll,
      scrollTop: messagesScrollTop,
      type: VirtualDomElements.Div,
    },
    ...displayMessages.flatMap((item) =>
      GetChatMessageDom.getChatMessageDom(
        item.message,
        item.parsedContent,
        openRouterApiKeyInput,
        openApiApiKeyInput,
        openRouterApiKeyState,
        useChatMathWorker,
      ),
    ),
  ]
}
