import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getMissingApiKeyDom } from '../GetMissingApiKeyDom/GetMissingApiKeyDom.ts'
import { OpenApiApiKeyInput, OpenOpenApiApiKeyWebsite, SaveOpenApiApiKey } from '../OpenApiApiKeyNames/OpenApiApiKeyNames.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const getMissingOpenApiApiKeyDom = (openApiApiKeyState: 'idle' | 'saving' = 'idle'): readonly VirtualDomNode[] => {
  const isSaving = openApiApiKeyState === 'saving'
  return getMissingApiKeyDom({
    getApiKeyText: Strings.getOpenApiApiKey(),
    inputName: OpenApiApiKeyInput,
    inputPattern: '^sk-.+',
    inputRequired: true,
    onSubmit: DomEventListenerFunctions.HandleMissingOpenAiApiKeyFormSubmit,
    openSettingsButtonName: OpenOpenApiApiKeyWebsite,
    openSettingsUrl: 'https://platform.openai.com/api-keys',
    placeholder: Strings.openApiApiKeyPlaceholder(),
    saveButtonDisabled: isSaving,
    saveButtonName: SaveOpenApiApiKey,
    saveButtonText: isSaving ? Strings.saving() : Strings.save(),
  })
}
