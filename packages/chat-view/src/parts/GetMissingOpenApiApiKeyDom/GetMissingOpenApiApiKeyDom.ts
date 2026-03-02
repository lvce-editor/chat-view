import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getMissingApiKeyDom } from '../GetMissingApiKeyDom/GetMissingApiKeyDom.ts'
import { OpenApiApiKeyInput, OpenOpenApiApiKeySettings, SaveOpenApiApiKey } from '../OpenApiApiKeyNames/OpenApiApiKeyNames.ts'

export const getMissingOpenApiApiKeyDom = (openApiApiKeyInput: string): readonly VirtualDomNode[] => {
  return getMissingApiKeyDom({
    inputValue: openApiApiKeyInput,
    inputName: OpenApiApiKeyInput,
    placeholder: Strings.openApiApiKeyPlaceholder(),
    saveButtonName: SaveOpenApiApiKey,
    openSettingsButtonName: OpenOpenApiApiKeySettings,
    getApiKeyText: Strings.getOpenApiApiKey(),
  })
}
