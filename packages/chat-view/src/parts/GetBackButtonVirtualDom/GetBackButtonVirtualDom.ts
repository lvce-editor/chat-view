import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

export const getBackButtonVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.IconButton,
      name: 'back',
      onClick: DomEventListenerFunctions.HandleClickBack,
      role: AriaRoles.Button,
      title: Strings.backToChats(),
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconArrowLeft',
      type: VirtualDomElements.Div,
    },
  ]
}
