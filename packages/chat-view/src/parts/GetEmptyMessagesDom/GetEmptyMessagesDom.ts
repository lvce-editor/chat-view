import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

export const getEmptyMessagesDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.ChatWelcomeMessage,
      onContextMenu: DomEventListenerFunctions.HandleChatWelcomeContextMenu,
      type: VirtualDomElements.Div,
    },
    text(Strings.startConversation()),
  ]
}
