import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { AuthUserState } from '../AuthUserState/AuthUserState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getBackButtonVirtualDom } from '../GetBackButtonVirtualDom/GetBackButtonVirtualDom.ts'
import { getChatHeaderActionsDom } from '../GetChatHeaderActionsDom/GetChatHeaderActionsDom.ts'
import { getChatHeaderAuthDom } from '../GetChatHeaderAuthDom/GetChatHeaderAuthDom.ts'

const getAuthErrorDom = (hasAuthError: boolean, authErrorMessage: string): readonly VirtualDomNode[] => {
  if (!hasAuthError) {
    return []
  }
  return [
    {
      childCount: 1,
      className: ClassNames.ChatAuthError,
      type: VirtualDomElements.Span,
    },
    text(authErrorMessage),
  ]
}

export const getChatHeaderDomDetailMode = (
  selectedSessionTitle: string,
  authEnabled = false,
  userState: AuthUserState = 'loggedOut',
  userName = '',
  authErrorMessage = '',
): readonly VirtualDomNode[] => {
  const hasAuthError = authEnabled && !!authErrorMessage
  return [
    {
      childCount: 2 + (authEnabled ? 1 : 0) + (hasAuthError ? 1 : 0),
      className: ClassNames.ChatHeader,
      onContextMenu: DomEventListenerFunctions.HandleChatHeaderContextMenu,
      type: VirtualDomElements.Header,
    },
    ...getChatHeaderAuthDom(authEnabled, userState, userName),
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
    ...getAuthErrorDom(hasAuthError, authErrorMessage),
  ]
}
