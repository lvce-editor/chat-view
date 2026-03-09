import { type VirtualDomNode, VirtualDomElements, mergeClassNames, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetChatMessageDom from '../GetChatMessageDom/GetChatMessageDom.ts'
import * as GetEmptyMessagesDom from '../GetEmptyMessagesDom/GetEmptyMessagesDom.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getToolCallsDom } from '../GetToolCallsDom/GetToolCallsDom.ts'

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
  const totalChildCount = messages.reduce((acc, m) => acc + 1 + ((m.toolCalls && m.toolCalls.length > 0) ? m.toolCalls.length : 0), 0)

  return [
    {
      childCount: totalChildCount,
      className: 'ChatMessages',
      onContextMenu: DomEventListenerFunctions.HandleMessagesContextMenu,
      onScroll: DomEventListenerFunctions.HandleMessagesScroll,
      scrollTop: messagesScrollTop,
      type: VirtualDomElements.Div,
    },
    ...messages.flatMap((message) => {
      const base = GetChatMessageDom.getChatMessageDom(message, openRouterApiKeyInput, openApiApiKeyInput, openRouterApiKeyState)
      const toolCallsDom = getToolCallsDom(message)
      if (!toolCallsDom || toolCallsDom.length === 0) {
        return base
      }
      const roleClassName = message.role === 'user' ? ClassNames.MessageUser : ClassNames.MessageAssistant
      const toolMessage = [
        {
          childCount: 1,
          className: mergeClassNames(ClassNames.Message, roleClassName),
          type: VirtualDomElements.Div,
        },
        {
          childCount: toolCallsDom.length,
          className: ClassNames.ChatMessageContent,
          type: VirtualDomElements.Div,
        },
        ...toolCallsDom,
      ]
      return [...base, ...toolMessage]
    }),
  ]
}
