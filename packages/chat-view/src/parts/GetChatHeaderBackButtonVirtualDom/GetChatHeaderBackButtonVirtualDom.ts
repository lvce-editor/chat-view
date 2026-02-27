import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
<<<<<<< HEAD
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
=======
import * as Strings from '../GetChatViewDom/GetChatViewDomStrings.ts'
>>>>>>> origin/main

export const getChatHeaderBackButtonVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.IconButton,
      name: 'back',
      role: AriaRoles.Button,
      tabIndex: 0,
      title: Strings.backToChats,
      type: VirtualDomElements.Button,
    },
    text('←'),
  ]
}
