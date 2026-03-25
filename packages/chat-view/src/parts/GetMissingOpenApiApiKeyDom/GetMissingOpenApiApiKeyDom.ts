import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getMissingApiKeyDom } from '../GetMissingApiKeyDom/GetMissingApiKeyDom.ts'
import { OpenApiApiKeyInput, OpenOpenApiApiKeyWebsite, SaveOpenApiApiKey } from '../OpenApiApiKeyNames/OpenApiApiKeyNames.ts'

 
export const getMissingOpenApiApiKeyDom = (
  openApiApiKeyState: 'idle' | 'saving' = 'idle',
  openSettingsUrl = 'https://platform.openai.com/api-keys',
  inputPattern = '^sk-.+',
): readonly VirtualDomNode[] => {
  const isSaving = openApiApiKeyState === 'saving'
  return getMissingApiKeyDom({
    getApiKeyText: Strings.getOpenApiApiKey(),
    inputName: OpenApiApiKeyInput,
    inputPattern,
    inputRequired: true,
    onSubmit: DomEventListenerFunctions.HandleMissingOpenAiApiKeyFormSubmit,
    openSettingsButtonName: OpenOpenApiApiKeyWebsite,
    openSettingsUrl,
    placeholder: Strings.openApiApiKeyPlaceholder(),
    saveButtonDisabled: isSaving,
    saveButtonName: SaveOpenApiApiKey,
    saveButtonText: isSaving ? Strings.saving() : Strings.save(),
  })
}
