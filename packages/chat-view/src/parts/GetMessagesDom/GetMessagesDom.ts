/* eslint-disable unicorn/no-array-reduce */
import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetChatMessageDom from '../GetChatMessageDom/GetChatMessageDom.ts'
import * as GetEmptyMessagesDom from '../GetEmptyMessagesDom/GetEmptyMessagesDom.ts'

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
  const messageDom = messages.flatMap((message) =>
    GetChatMessageDom.getChatMessageDom(message, openRouterApiKeyInput, openApiApiKeyInput, openRouterApiKeyState),
  )
  const childCount = messageDom.reduce((total, node) => {
    if (!node.className) {
      return total
    }
    return total + (node.className.split(' ').includes(ClassNames.Message) ? 1 : 0)
  }, 0)
  return [
    {
      childCount,
      className: 'ChatMessages',
      onContextMenu: DomEventListenerFunctions.HandleMessagesContextMenu,
      onScroll: DomEventListenerFunctions.HandleMessagesScroll,
      scrollTop: messagesScrollTop,
      type: VirtualDomElements.Div,
    },
    ...messageDom,
  ]
}
