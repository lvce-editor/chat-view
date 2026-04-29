import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getMissingApiKeyDom } from '../GetMissingApiKeyDom/GetMissingApiKeyDom.ts'
import { OpenApiApiKeyInput, OpenOpenApiApiKeyWebsite, SaveOpenApiApiKey } from '../OpenApiApiKeyNames/OpenApiApiKeyNames.ts'

export const getMissingOpenApiApiKeyDom = (
  openApiApiKeyInput = '',
  openApiApiKeyState: 'idle' | 'saving' = 'idle',
  openSettingsUrl = 'https://platform.openai.com/api-keys',
  inputPattern = '^sk-.+',
): readonly VirtualDomNode[] => {
  const isSaving = openApiApiKeyState === 'saving'
  const isInvalid = openApiApiKeyInput !== '' && !new RegExp(inputPattern).test(openApiApiKeyInput)
  return getMissingApiKeyDom({
    getApiKeyText: Strings.getOpenApiApiKey(),
    ...(isInvalid ? { inputClassName: ClassNames.InputInvalid } : {}),
    inputName: OpenApiApiKeyInput,
    inputPattern,
    inputRequired: false,
    inputType: 'password',
    onSubmit: DomEventListenerFunctions.HandleMissingOpenAiApiKeyFormSubmit,
    openSettingsButtonName: OpenOpenApiApiKeyWebsite,
    openSettingsUrl,
    placeholder: Strings.openApiApiKeyPlaceholder(),
    saveButtonDisabled: isSaving,
    saveButtonName: SaveOpenApiApiKey,
    saveButtonText: isSaving ? Strings.saving() : Strings.save(),
  })
}
