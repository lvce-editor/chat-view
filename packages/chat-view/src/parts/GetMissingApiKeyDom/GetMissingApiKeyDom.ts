import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

export interface MissingApiKeyDomParams {
  readonly inputValue: string
  readonly inputName: string
  readonly placeholder: string
  readonly saveButtonName: string
  readonly openSettingsButtonName: string
  readonly getApiKeyText: string
}

export const getMissingApiKeyDom = ({
  inputValue,
  inputName,
  placeholder,
  saveButtonName,
  openSettingsButtonName,
  getApiKeyText,
}: MissingApiKeyDomParams): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: ClassNames.InputBox,
      name: inputName,
      onInput: DomEventListenerFunctions.HandleInput,
      placeholder,
      type: VirtualDomElements.Input,
      value: inputValue,
    },
    {
      childCount: 2,
      className: ClassNames.Actions,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Button, ClassNames.ButtonPrimary),
      name: saveButtonName,
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(Strings.save()),
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Button, ClassNames.ButtonSecondary),
      name: openSettingsButtonName,
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(getApiKeyText),
  ]
}
