import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getMissingApiKeyDom } from '../GetMissingApiKeyDom/GetMissingApiKeyDom.ts'
import {
  OpenApiApiKeyInput,
  OpenOpenApiApiKeySettings,
  OpenOpenApiApiKeyWebsite,
  SaveOpenApiApiKey,
} from '../OpenApiApiKeyNames/OpenApiApiKeyNames.ts'

export const getMissingOpenApiApiKeyDom = (openApiApiKeyInput: string): readonly VirtualDomNode[] => {
  return getMissingApiKeyDom({
    getApiKeyButtonName: OpenOpenApiApiKeyWebsite,
    getApiKeyText: Strings.getOpenApiApiKey(),
    inputName: OpenApiApiKeyInput,
    inputValue: openApiApiKeyInput,
    openSettingsButtonName: OpenOpenApiApiKeySettings,
    placeholder: Strings.openApiApiKeyPlaceholder(),
    saveButtonName: SaveOpenApiApiKey,
  })
}
