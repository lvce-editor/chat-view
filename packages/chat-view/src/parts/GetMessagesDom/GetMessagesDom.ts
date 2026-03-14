import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetChatMessageDom from '../GetChatMessageDom/GetChatMessageDom.ts'
import * as GetEmptyMessagesDom from '../GetEmptyMessagesDom/GetEmptyMessagesDom.ts'

const hasMessageText = (message: ChatMessage): boolean => {
  return message.text.trim().length > 0
}

interface DisplayMessage {
  readonly message: ChatMessage
  readonly parsedMessage: readonly MessageIntermediateNode[]
}

const getDisplayMessages = (
  messages: readonly ChatMessage[],
  parsedMessages: readonly (readonly MessageIntermediateNode[])[],
): readonly DisplayMessage[] => {
  const displayMessages: DisplayMessage[] = []
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    const parsedMessage = parsedMessages[i] || []
    if (message.role !== 'assistant' || !message.toolCalls || message.toolCalls.length === 0) {
      displayMessages.push({
        message,
        parsedMessage,
      })
      continue
    }
    displayMessages.push({
      message: {
        ...message,
        text: '',
      },
      parsedMessage: [],
    })
    if (hasMessageText(message)) {
      const { toolCalls: _toolCalls, ...messageWithoutToolCalls } = message
      displayMessages.push({
        message: {
          ...messageWithoutToolCalls,
        },
        parsedMessage,
      })
    }
  }
  return displayMessages
}

export const getMessagesDom = (
  messages: readonly ChatMessage[],
  openRouterApiKeyInput: string,
  openApiApiKeyInput = '',
  openRouterApiKeyState: 'idle' | 'saving' = 'idle',
  messagesScrollTop = 0,
  useChatMathWorker = false,
  parsedMessages: readonly (readonly MessageIntermediateNode[])[] = [],
): readonly VirtualDomNode[] => {
  if (messages.length === 0) {
    return GetEmptyMessagesDom.getEmptyMessagesDom()
  }
  const displayMessages = getDisplayMessages(messages, parsedMessages)
  return [
    {
      childCount: displayMessages.length,
      className: 'ChatMessages',
      onContextMenu: DomEventListenerFunctions.HandleMessagesContextMenu,
      onScroll: DomEventListenerFunctions.HandleMessagesScroll,
      scrollTop: messagesScrollTop,
      type: VirtualDomElements.Div,
    },
    ...displayMessages.flatMap((displayMessage) =>
      GetChatMessageDom.getChatMessageDom(
        displayMessage.message,
        displayMessage.parsedMessage,
        openRouterApiKeyInput,
        openApiApiKeyInput,
        openRouterApiKeyState,
        useChatMathWorker,
      ),
    ),
  ]
}
