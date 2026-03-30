import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatSearchDom = (hasSearchField: boolean, searchValue: string): readonly VirtualDomNode[] => {
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
