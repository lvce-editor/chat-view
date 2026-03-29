import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { AuthUserState } from '../AuthUserState/AuthUserState.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatHeaderActionsDom } from '../GetChatHeaderActionsDom/GetChatHeaderActionsDom.ts'
import { getChatHeaderAuthDom } from '../GetChatHeaderAuthDom/GetChatHeaderAuthDom.ts'
import * as InputName from '../InputName/InputName.ts'

const getChatSearchDom = (hasSearchField: boolean, searchValue: string): readonly VirtualDomNode[] => {
  if (!hasSearchField) {
    return []
  }
  return [
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
}

export const getChatHeaderListModeDom = (
  authEnabled = false,
  userState: AuthUserState = 'loggedOut',
  userName = '',
  authErrorMessage = '',
  searchEnabled = false,
  searchFieldVisible = false,
  searchValue = '',
): readonly VirtualDomNode[] => {
  const hasAuthError = authEnabled && !!authErrorMessage
  const hasSearchField = searchEnabled && searchFieldVisible
  const headerChildCount = 2 + (authEnabled ? 1 : 0) + (hasAuthError ? 1 : 0) + (hasSearchField ? 1 : 0)
  return [
    {
      childCount: headerChildCount,
      className: ClassNames.ChatHeader,
      onContextMenu: DomEventListenerFunctions.HandleChatHeaderContextMenu,
      type: VirtualDomElements.Header,
    },
    ...getChatHeaderAuthDom(authEnabled, userState, userName),
    {
      childCount: 1,
      className: ClassNames.ChatHeaderLabel,
      type: VirtualDomElements.H2,
    },
    text(Strings.chats()),
    ...getChatHeaderActionsDom('list', searchEnabled),
    ...getChatSearchDom(hasSearchField, searchValue),
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
