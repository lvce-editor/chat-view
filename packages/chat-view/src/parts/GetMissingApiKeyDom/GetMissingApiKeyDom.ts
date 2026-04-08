import { type VirtualDomNode, mergeClassNames, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { MissingApiKeyDomParams } from '../MissingApiKeyDomParams/MissingApiKeyDomParams.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

const getMissingApiActionsDom = ({
  getApiKeyText,
  openSettingsButtonName,
  openSettingsUrl,
  saveButtonDisabled = false,
  saveButtonName,
  saveButtonText = Strings.save(),
}: Pick<
  MissingApiKeyDomParams,
  'getApiKeyText' | 'openSettingsButtonName' | 'openSettingsUrl' | 'saveButtonDisabled' | 'saveButtonName' | 'saveButtonText'
>): readonly VirtualDomNode[] => {
  return [
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

export const getMissingApiKeyDom = ({
  getApiKeyText,
  inputClassName,
  inputName,
  inputPattern,
  inputRequired = false,
  onSubmit,
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
      onSubmit,
      type: VirtualDomElements.Form,
    },
    {
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      childCount: 0,
      className: inputClassName ? mergeClassNames(ClassNames.InputBox, inputClassName) : ClassNames.InputBox,
      name: inputName,
      onInput: DomEventListenerFunctions.HandleInput,
      ...(inputPattern ? { pattern: inputPattern } : {}),
      placeholder,
      required: inputRequired,
      spellcheck: false,
      type: VirtualDomElements.Input,
    },
    ...getMissingApiActionsDom({
      getApiKeyText,
      openSettingsButtonName,
      openSettingsUrl,
      saveButtonDisabled,
      saveButtonName,
      saveButtonText,
    }),
  ]
}
