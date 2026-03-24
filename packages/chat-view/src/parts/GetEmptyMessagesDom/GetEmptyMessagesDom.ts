import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

const parentNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ChatWelcomeMessage,
  onContextMenu: DomEventListenerFunctions.HandleChatWelcomeContextMenu,
  type: VirtualDomElements.Div,
}

export const getEmptyMessagesDom = (): readonly VirtualDomNode[] => {
  return [parentNode, text(Strings.startConversation())]
}
