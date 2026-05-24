/* cspell:ignore sonarjs */

import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ParsedMessage } from '../ParsedMessage/ParsedMessage.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetChatMessageDom from '../GetChatMessageDom/GetChatMessageDom.ts'
import { getDisplayMessages } from '../GetDisplayMessages/GetDisplayMessages.ts'
import * as GetEmptyMessagesDom from '../GetEmptyMessagesDom/GetEmptyMessagesDom.ts'

export const getMessagesDom = (
  messages: readonly ChatMessage[],
  parsedMessages: readonly ParsedMessage[],
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
        className: ClassNames.ChatMessages,
        onContextMenu: DomEventListenerFunctions.HandleMessagesContextMenu,
        onScroll: DomEventListenerFunctions.HandleMessagesScroll,
        role: AriaRoles.Log,
        scrollTop: messagesScrollTop,
        type: VirtualDomElements.Div,
      },
    ]
  }
  const displayMessages = getDisplayMessages(messages, parsedMessages)
  return [
    {
      childCount: displayMessages.length,
      className: ClassNames.ChatMessages,
      onContextMenu: DomEventListenerFunctions.HandleMessagesContextMenu,
      onScroll: DomEventListenerFunctions.HandleMessagesScroll,
      role: AriaRoles.Log,
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
