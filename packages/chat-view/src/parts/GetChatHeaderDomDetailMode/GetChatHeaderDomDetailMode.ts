import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getBackButtonVirtualDom } from '../GetBackButtonVirtualDom/GetBackButtonVirtualDom.ts'
import { getChatHeaderActionsDom } from '../GetChatHeaderActionsDom/GetChatHeaderActionsDom.ts'

const chatHeaderNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.ChatHeader,
  onContextMenu: DomEventListenerFunctions.HandleChatHeaderContextMenu,
  type: VirtualDomElements.Header,
}

const chatNameNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.ChatName,
  type: VirtualDomElements.Div,
}

const chatHeaderLabelNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ChatHeaderLabel,
  type: VirtualDomElements.H2,
}

export const getChatHeaderDomDetailMode = (
  selectedSessionTitle: string,
  _authEnabled = false,
  _userState = 'loggedOut',
  _userName = '',
  _authErrorMessage = '',
): readonly VirtualDomNode[] => {
  return [
    chatHeaderNode,
    chatNameNode,
    ...getBackButtonVirtualDom(),
    chatHeaderLabelNode,
    text(selectedSessionTitle),
    ...getChatHeaderActionsDom('detail'),
  ]
}
