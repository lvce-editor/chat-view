import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { type MissingApiKeyDomParams } from './MissingApiKeyDomParams/MissingApiKeyDomParams.ts'

export const getMissingApiKeyDom = ({
  getApiKeyText,
  inputName,
  inputPattern,
  inputRequired = false,
  inputValue,
  openSettingsButtonName,
  placeholder,
  saveButtonDisabled = false,
  saveButtonName,
  saveButtonText = Strings.save(),
}: MissingApiKeyDomParams): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      method: 'GET',
      onSubmit: DomEventListenerFunctions.HandleMissingApiKeySubmit,
      type: VirtualDomElements.Form,
    },
    {
      childCount: 0,
      className: ClassNames.InputBox,
      name: inputName,
      onInput: DomEventListenerFunctions.HandleInput,
      ...(inputPattern ? { pattern: inputPattern } : {}),
      placeholder,
      required: inputRequired,
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
      disabled: saveButtonDisabled,
      inputType: 'submit',
      name: saveButtonName,
      type: VirtualDomElements.Button,
    },
    text(saveButtonText),
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Button, ClassNames.ButtonSecondary),
      inputType: 'button',
      name: openSettingsButtonName,
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(getApiKeyText),
  ]
}
