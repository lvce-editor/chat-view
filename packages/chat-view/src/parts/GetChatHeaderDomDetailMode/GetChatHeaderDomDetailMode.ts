import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getBackButtonVirtualDom } from '../GetBackButtonVirtualDom/GetBackButtonVirtualDom.ts'
import { getChatHeaderActionsDom } from '../GetChatHeaderActionsDom/GetChatHeaderActionsDom.ts'

export const getChatHeaderDomDetailMode = (
  selectedSessionTitle: string,
  _authEnabled = false,
  _userState = 'loggedOut',
  _userName = '',
  _authErrorMessage = '',
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: ClassNames.ChatHeader,
      onContextMenu: DomEventListenerFunctions.HandleChatHeaderContextMenu,
      type: VirtualDomElements.Header,
    },
    {
      childCount: 2,
      className: ClassNames.ChatName,
      type: VirtualDomElements.Div,
    },
    ...getBackButtonVirtualDom(),
    {
      childCount: 1,
      className: ClassNames.ChatHeaderLabel,
      type: VirtualDomElements.H2,
    },
    text(selectedSessionTitle),
    ...getChatHeaderActionsDom('detail'),
  ]
}
