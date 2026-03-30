import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../InputName/InputName.ts'

export const getModelPickerHeaderDom = (modelPickerSearchValue: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.ChatModelPickerHeader,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: ClassNames.InputBox,
      inputType: 'search',
      name: InputName.ModelPickerSearch,
      onBlur: DomEventListenerFunctions.HandleModelInputBlur,
      onClick: DomEventListenerFunctions.HandlePointerDownModelPickerList,
      onInput: DomEventListenerFunctions.HandleInput,
      onPointerDown: DomEventListenerFunctions.HandlePointerDownModelPickerList,
      placeholder: Strings.searchModels(),
      type: VirtualDomElements.Input,
      value: modelPickerSearchValue,
    },
  ]
}
