import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatState/ChatState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { openRouterApiKeyRequiredMessage } from '../OpenRouterApiKeyRequiredMessage/OpenRouterApiKeyRequiredMessage.ts'

const SAVE_OPEN_ROUTER_API_KEY = 'save-openrouter-api-key'

export const getChatMessageDom = (message: ChatMessage, openRouterApiKeyInput: string): readonly VirtualDomNode[] => {
  const roleClassName = message.role === 'user' ? ClassNames.MessageUser : ClassNames.MessageAssistant
  const isOpenRouterApiKeyMissingMessage = message.role === 'assistant' && message.text === openRouterApiKeyRequiredMessage
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Message, roleClassName),
      type: VirtualDomElements.Div,
    },
    {
      childCount: isOpenRouterApiKeyMissingMessage ? 3 : 1,
      className: ClassNames.ChatMessageContent,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.Markdown,
      type: VirtualDomElements.P,
    },
    text(message.text),
    ...(isOpenRouterApiKeyMissingMessage
      ? [
          {
            childCount: 0,
            className: ClassNames.MultilineInputBox,
            name: 'open-router-api-key',
            onInput: DomEventListenerFunctions.HandleInput,
            placeholder: Strings.openRouterApiKeyPlaceholder,
            rows: 2,
            type: VirtualDomElements.TextArea,
            value: openRouterApiKeyInput,
          },
          {
            childCount: 1,
            className: ClassNames.Button,
            name: SAVE_OPEN_ROUTER_API_KEY,
            onClick: DomEventListenerFunctions.HandleClick,
            type: VirtualDomElements.Button,
          },
          text(Strings.save),
        ]
      : []),
  ]
}
