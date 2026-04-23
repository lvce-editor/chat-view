import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { AuthUserState } from '../AuthUserState/AuthUserState.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatHeaderActionsDom } from '../GetChatHeaderActionsDom/GetChatHeaderActionsDom.ts'
import { getChatHeaderAuthDom } from '../GetChatHeaderAuthDom/GetChatHeaderAuthDom.ts'
import { getChatSearchDom } from '../GetChatSearchDom/GetChatSearchDom.ts'

export const getChatHeaderListModeDom = (
  authEnabled = false,
  userState: AuthUserState = 'loggedOut',
  userName = '',
  authErrorMessage = '',
  searchEnabled = false,
  searchFieldVisible = false,
  searchValue = '',
): readonly VirtualDomNode[] => {
  const hasSearchField = searchEnabled && searchFieldVisible
  const headerChildCount = 2 + (authEnabled ? 1 : 0) + (hasSearchField ? 1 : 0)
  return [
    {
      childCount: headerChildCount,
      className: ClassNames.ChatHeader,
      onContextMenu: DomEventListenerFunctions.HandleChatHeaderContextMenu,
      type: VirtualDomElements.Header,
    },
    ...getChatHeaderAuthDom(authEnabled, userState, userName, authErrorMessage),
    {
      childCount: 1,
      className: ClassNames.ChatHeaderLabel,
      type: VirtualDomElements.H2,
    },
    text(Strings.chats()),
    ...getChatHeaderActionsDom('list', searchEnabled),
    ...getChatSearchDom(hasSearchField, searchValue),
  ]
}
