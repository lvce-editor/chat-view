import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getChatHeaderActionsDom } from '../GetChatHeaderActionsDom/GetChatHeaderActionsDom.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

export const getChatHeaderListModeDom = (
  authEnabled = false,
  authStatus: 'signed-out' | 'signing-in' | 'signed-in' = 'signed-out',
  authErrorMessage = '',
): readonly VirtualDomNode[] => {
  const hasAuthError = authEnabled && !!authErrorMessage
  return [
    {
      childCount: hasAuthError ? 3 : 2,
      className: ClassNames.ChatHeader,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.Label,
      type: VirtualDomElements.Span,
    },
    text(Strings.chats()),
    ...getChatHeaderActionsDom('list', authEnabled, authStatus),
    ...(hasAuthError
      ? [
          {
            childCount: 1,
            className: ClassNames.ChatAuthError,
            type: VirtualDomElements.Span,
          },
          text(authErrorMessage),
        ]
      : []),
  ]
}
