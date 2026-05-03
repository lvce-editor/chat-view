import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatHeaderActionsDom } from '../GetChatHeaderActionsDom/GetChatHeaderActionsDom.ts'
import { getChatSearchDom } from '../GetChatSearchDom/GetChatSearchDom.ts'

export const getChatHeaderListModeDom = (
  _authEnabled = false,
  _userState = 'loggedOut',
  _userName = '',
  _authErrorMessage = '',
  searchEnabled = false,
  searchFieldVisible = false,
  searchValue = '',
): readonly VirtualDomNode[] => {
  const hasSearchField = searchEnabled && searchFieldVisible
  const headerChildCount = 2 + (hasSearchField ? 1 : 0)
  return [
    {
      childCount: headerChildCount,
      className: ClassNames.ChatHeader,
      onContextMenu: DomEventListenerFunctions.HandleChatHeaderContextMenu,
      type: VirtualDomElements.Header,
    },
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
