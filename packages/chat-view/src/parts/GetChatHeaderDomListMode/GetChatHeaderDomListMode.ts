import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatHeaderActionsDom } from '../GetChatHeaderActionsDom/GetChatHeaderActionsDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatHeaderListModeDom = (
  authEnabled = false,
  authStatus: 'signed-out' | 'signing-in' | 'signed-in' = 'signed-out',
  authErrorMessage = '',
  searchEnabled = false,
  searchFieldVisible = false,
  searchValue = '',
): readonly VirtualDomNode[] => {
  const hasAuthError = authEnabled && !!authErrorMessage
  const hasSearchField = searchEnabled && searchFieldVisible
  const headerChildCount = 2 + (hasAuthError ? 1 : 0) + (hasSearchField ? 1 : 0)
  return [
    {
      childCount: headerChildCount,
      className: ClassNames.ChatHeader,
      onContextMenu: DomEventListenerFunctions.HandleChatHeaderContextMenu,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.ChatHeaderLabel,
      type: VirtualDomElements.H2,
    },
    text(Strings.chats()),
    ...getChatHeaderActionsDom('list', authEnabled, authStatus, searchEnabled),
    ...(hasSearchField
      ? [
          {
            childCount: 1,
            className: ClassNames.SearchFieldContainer,
            type: VirtualDomElements.Div,
          },
          {
            childCount: 0,
            className: ClassNames.InputBox,
            inputType: 'search',
            name: InputName.Search,
            onInput: DomEventListenerFunctions.HandleSearchInput,
            placeholder: Strings.searchChats(),
            type: VirtualDomElements.Input,
            value: searchValue,
          },
        ]
      : []),
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
