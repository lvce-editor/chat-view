import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getMissingApiKeyDom } from '../GetMissingApiKeyDom/GetMissingApiKeyDom.ts'
import { OpenOpenRouterApiKeySettings, OpenRouterApiKeyInput, SaveOpenRouterApiKey } from '../OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'

export const getMissingOpenRouterApiKeyDom = (openRouterApiKeyState: 'idle' | 'saving' = 'idle'): readonly VirtualDomNode[] => {
  const isSaving = openRouterApiKeyState === 'saving'
  return getMissingApiKeyDom({
    getApiKeyText: Strings.getOpenRouterApiKey(),
    inputName: OpenRouterApiKeyInput,
    openSettingsButtonName: OpenOpenRouterApiKeySettings,
    placeholder: Strings.openRouterApiKeyPlaceholder(),
    saveButtonDisabled: isSaving,
    saveButtonName: SaveOpenRouterApiKey,
    saveButtonText: isSaving ? Strings.saving() : Strings.save(),
  })
}
