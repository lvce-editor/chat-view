import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { DisplayMessage } from '../GetDisplayMessages/GetDisplayMessages.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetChatMessageDom from '../GetChatMessageDom/GetChatMessageDom.ts'
import * as GetEmptyMessagesDom from '../GetEmptyMessagesDom/GetEmptyMessagesDom.ts'

export const getMessagesDom = (
  messages: readonly ChatMessage[],
  displayMessages: readonly DisplayMessage[],
  openRouterApiKeyInput: string,
  openApiApiKeyInput = '',
  openApiApiKeyState: 'idle' | 'saving' = 'idle',
  openApiApiKeysSettingsUrl = 'https://platform.openai.com/api-keys',
  openApiApiKeyInputPattern = '^sk-.+',
  openRouterApiKeyState: 'idle' | 'saving' = 'idle',
  messagesScrollTop = 0,
  useChatMathWorker = false,
  hideWelcomeMessage = false,
): readonly VirtualDomNode[] => {
  if (messages.length === 0) {
    if (!hideWelcomeMessage) {
      return GetEmptyMessagesDom.getEmptyMessagesDom()
    }
    return [
      {
        childCount: 0,
        className: 'ChatMessages',
        onContextMenu: DomEventListenerFunctions.HandleMessagesContextMenu,
        onScroll: DomEventListenerFunctions.HandleMessagesScroll,
        role: 'log',
        scrollTop: messagesScrollTop,
        type: VirtualDomElements.Div,
      },
    ]
  }
  return [
    {
      childCount: displayMessages.length,
      className: 'ChatMessages',
      onContextMenu: DomEventListenerFunctions.HandleMessagesContextMenu,
      onScroll: DomEventListenerFunctions.HandleMessagesScroll,
      role: 'log',
      scrollTop: messagesScrollTop,
      type: VirtualDomElements.Div,
    },
    ...displayMessages.flatMap((item) =>
      GetChatMessageDom.getChatMessageDom(
        item.message,
        item.parsedContent,
        openRouterApiKeyInput,
        openApiApiKeyInput,
        openApiApiKeyState,
        openApiApiKeysSettingsUrl,
        openApiApiKeyInputPattern,
        openRouterApiKeyState,
        useChatMathWorker,
        item.standaloneImageAttachment,
      ),
    ),
  ]
}
