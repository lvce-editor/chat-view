import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDom/GetChatViewDomStrings.ts'

export const getChatHeaderActionsDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 3,
      className: ClassNames.ChatActions,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.IconButton,
      name: 'create-session',
      role: AriaRoles.Button,
      tabIndex: 0,
      title: Strings.newChat,
      type: VirtualDomElements.Button,
    },
    text('+'),
    {
      childCount: 1,
      className: ClassNames.IconButton,
      onClick: DomEventListenerFunctions.HandleClickSettings,
      role: AriaRoles.Button,
      tabIndex: 0,
      title: Strings.settings,
      type: VirtualDomElements.Button,
    },
    text('⚙'),
    {
      childCount: 1,
      className: ClassNames.IconButton,
      onClick: DomEventListenerFunctions.HandleClickClose,
      role: AriaRoles.Button,
      tabIndex: 0,
      title: Strings.closeChat,
      type: VirtualDomElements.Button,
    },
    text('×'),
  ]
}
