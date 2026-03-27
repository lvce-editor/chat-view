import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getBackButtonVirtualDom } from '../GetBackButtonVirtualDom/GetBackButtonVirtualDom.ts'
import { getChatHeaderActionsDom } from '../GetChatHeaderActionsDom/GetChatHeaderActionsDom.ts'

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
  authStatus: 'signed-out' | 'signing-in' | 'signed-in' = 'signed-out',
  authErrorMessage = '',
): readonly VirtualDomNode[] => {
  const hasAuthError = authEnabled && !!authErrorMessage
  return [
    {
      childCount: hasAuthError ? 3 : 2,
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
    ...getChatHeaderActionsDom('detail', authEnabled, authStatus),
    ...getAuthErrorDom(hasAuthError, authErrorMessage),
  ]
}
