import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getMissingApiKeyDom } from '../GetMissingApiKeyDom/GetMissingApiKeyDom.ts'
import { OpenApiApiKeyInput, OpenOpenApiApiKeyWebsite, SaveOpenApiApiKey } from '../OpenApiApiKeyNames/OpenApiApiKeyNames.ts'

export const getMissingOpenApiApiKeyDom = (): readonly VirtualDomNode[] => {
  return getMissingApiKeyDom({
    getApiKeyText: Strings.getOpenApiApiKey(),
    inputName: OpenApiApiKeyInput,
    inputPattern: '^sk-.+',
    inputRequired: true,
    openSettingsButtonName: OpenOpenApiApiKeyWebsite,
    openSettingsUrl: 'https://platform.openai.com/api-keys',
    placeholder: Strings.openApiApiKeyPlaceholder(),
    saveButtonName: SaveOpenApiApiKey,
  })
}
