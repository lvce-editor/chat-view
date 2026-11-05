import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { AuthUserState } from '../AuthUserState/AuthUserState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getBackButtonVirtualDom } from '../GetBackButtonVirtualDom/GetBackButtonVirtualDom.ts'
import { getChatHeaderActionsDom } from '../GetChatHeaderActionsDom/GetChatHeaderActionsDom.ts'
import { getChatHeaderAuthDom } from '../GetChatHeaderAuthDom/GetChatHeaderAuthDom.ts'

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
  authEnabled = false,
  userState: AuthUserState = 'loggedOut',
  userName = '',
  authErrorMessage = '',
): readonly VirtualDomNode[] => {
  const headerNode = authEnabled ? { ...chatHeaderNode, childCount: chatHeaderNode.childCount + 1 } : chatHeaderNode
  return [
    headerNode,
    chatNameNode,
    ...getBackButtonVirtualDom(),
    chatHeaderLabelNode,
    text(selectedSessionTitle),
    ...getChatHeaderActionsDom('detail'),
    ...getChatHeaderAuthDom(authEnabled, userState, userName, authErrorMessage),
  ]
}
