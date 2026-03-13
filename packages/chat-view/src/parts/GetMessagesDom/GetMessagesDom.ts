import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetChatMessageDom from '../GetChatMessageDom/GetChatMessageDom.ts'
import * as GetEmptyMessagesDom from '../GetEmptyMessagesDom/GetEmptyMessagesDom.ts'

const hasMessageText = (message: ChatMessage): boolean => {
  return message.text.trim().length > 0
}

const getDisplayMessages = (messages: readonly ChatMessage[]): readonly ChatMessage[] => {
  const displayMessages: ChatMessage[] = []
  for (const message of messages) {
    if (message.role !== 'assistant' || !message.toolCalls || message.toolCalls.length === 0) {
      displayMessages.push(message)
      continue
    }
    displayMessages.push({
      ...message,
      text: '',
    })
    if (hasMessageText(message)) {
      const { toolCalls: _toolCalls, ...messageWithoutToolCalls } = message
      displayMessages.push({
        ...messageWithoutToolCalls,
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
): readonly VirtualDomNode[] => {
  if (messages.length === 0) {
    return GetEmptyMessagesDom.getEmptyMessagesDom()
  }
  const displayMessages = getDisplayMessages(messages)
  return [
    {
      childCount: displayMessages.length,
      className: 'ChatMessages',
      onContextMenu: DomEventListenerFunctions.HandleMessagesContextMenu,
      onScroll: DomEventListenerFunctions.HandleMessagesScroll,
      scrollTop: messagesScrollTop,
      type: VirtualDomElements.Div,
    },
    ...displayMessages.flatMap((message) =>
      GetChatMessageDom.getChatMessageDom(message, openRouterApiKeyInput, openApiApiKeyInput, openRouterApiKeyState),
    ),
  ]
}
