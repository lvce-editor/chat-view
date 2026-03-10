import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getMissingApiKeyDom } from '../GetMissingApiKeyDom/GetMissingApiKeyDom.ts'
import {
  OpenOpenRouterApiKeySettings,
  OpenOpenRouterApiKeyWebsite,
  OpenRouterApiKeyInput,
  SaveOpenRouterApiKey,
} from '../OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'

export const getMissingOpenRouterApiKeyDom = (
  openRouterApiKeyInput: string,
  openRouterApiKeyState: 'idle' | 'saving' = 'idle',
): readonly VirtualDomNode[] => {
  const isSaving = openRouterApiKeyState === 'saving'
  return getMissingApiKeyDom({
    getApiKeyButtonName: OpenOpenRouterApiKeyWebsite,
    getApiKeyText: Strings.getOpenRouterApiKey(),
    inputName: OpenRouterApiKeyInput,
    inputValue: openRouterApiKeyInput,
    openSettingsButtonName: OpenOpenRouterApiKeySettings,
    placeholder: Strings.openRouterApiKeyPlaceholder(),
    saveButtonDisabled: isSaving,
    saveButtonName: SaveOpenRouterApiKey,
    saveButtonText: isSaving ? Strings.saving() : Strings.save(),
  })
}
