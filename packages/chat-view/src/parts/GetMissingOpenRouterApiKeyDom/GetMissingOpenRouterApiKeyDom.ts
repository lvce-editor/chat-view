import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getMissingApiKeyDom } from '../GetMissingApiKeyDom/GetMissingApiKeyDom.ts'
import { OpenOpenRouterApiKeySettings, OpenRouterApiKeyInput, SaveOpenRouterApiKey } from '../OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'

export const getMissingOpenRouterApiKeyDom = (openRouterApiKeyInput: string): readonly VirtualDomNode[] => {
  return getMissingApiKeyDom({
    getApiKeyText: Strings.getOpenRouterApiKey(),
    inputName: OpenRouterApiKeyInput,
    inputValue: openRouterApiKeyInput,
    openSettingsButtonName: OpenOpenRouterApiKeySettings,
    placeholder: Strings.openRouterApiKeyPlaceholder(),
    saveButtonName: SaveOpenRouterApiKey,
  })
}
