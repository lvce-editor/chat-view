import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { type MissingApiKeyDomParams } from './MissingApiKeyDomParams.ts'

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
  saveButtonType = 'button',
  useForm = false,
}: MissingApiKeyDomParams): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      type: useForm ? VirtualDomElements.Form : VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: ClassNames.InputBox,
      name: inputName,
      onInput: DomEventListenerFunctions.HandleInput,
      pattern: inputPattern,
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
      buttonType: saveButtonType,
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
      name: openSettingsButtonName,
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(getApiKeyText),
  ]
}
