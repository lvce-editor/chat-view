import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { type MissingApiKeyDomParams } from './MissingApiKeyDomParams.ts'

export const getMissingApiKeyDom = ({
  getApiKeyButtonName,
  getApiKeyText,
  inputName,
  inputValue,
  openSettingsButtonName,
  openSettingsButtonText = Strings.settings(),
  placeholder,
  saveButtonDisabled = false,
  saveButtonName,
  saveButtonText = Strings.save(),
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
      required: true,
      type: VirtualDomElements.Input,
      value: inputValue,
    },
    {
      childCount: 3,
      className: ClassNames.Actions,
      type: VirtualDomElements.Div,
    },
    {
      buttonType: 'submit',
      childCount: 1,
      className: mergeClassNames(ClassNames.Button, ClassNames.ButtonPrimary),
      disabled: saveButtonDisabled,
      name: saveButtonName,
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(saveButtonText),
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Button, ClassNames.ButtonSecondary),
      name: getApiKeyButtonName,
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(getApiKeyText),
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Button, ClassNames.ButtonSecondary),
      name: openSettingsButtonName,
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(openSettingsButtonText),
  ]
}
