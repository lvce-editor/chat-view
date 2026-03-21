import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { type MissingApiKeyDomParams } from '../MissingApiKeyDomParams/MissingApiKeyDomParams.ts'

export const getMissingApiKeyDom = ({
  getApiKeyText,
  inputName,
  inputPattern,
  inputRequired = false,
  openSettingsButtonName,
  openSettingsUrl,
  placeholder,
  saveButtonDisabled = false,
  saveButtonName,
  saveButtonText = Strings.save(),
}: MissingApiKeyDomParams): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: ClassNames.MissingApiKeyForm,
      method: 'GET',
      onSubmit: DomEventListenerFunctions.HandleMissingApiKeySubmit,
      type: VirtualDomElements.Form,
    },
    {
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      childCount: 0,
      className: ClassNames.InputBox,
      name: inputName,
      onInput: DomEventListenerFunctions.HandleInput,
      ...(inputPattern ? { pattern: inputPattern } : {}),
      placeholder,
      required: inputRequired,
      spellcheck: false,
      type: VirtualDomElements.Input,
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
      href: openSettingsUrl,
      name: openSettingsButtonName,
      rel: 'noopener noreferrer',
      target: '_blank',
      type: VirtualDomElements.A,
    },
    text(getApiKeyText),
  ]
}
