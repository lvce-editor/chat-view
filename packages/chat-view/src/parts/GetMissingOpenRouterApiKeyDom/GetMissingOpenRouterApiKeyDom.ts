import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getMissingApiKeyDom } from '../GetMissingApiKeyDom/GetMissingApiKeyDom.ts'
import { OpenOpenRouterApiKeySettings, OpenRouterApiKeyInput, SaveOpenRouterApiKey } from '../OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'

export const getMissingOpenRouterApiKeyDom = (openRouterApiKeyState: 'idle' | 'saving' = 'idle'): readonly VirtualDomNode[] => {
  const isSaving = openRouterApiKeyState === 'saving'
  return getMissingApiKeyDom({
    getApiKeyText: Strings.getOpenRouterApiKey(),
    inputName: OpenRouterApiKeyInput,
    onSubmit: DomEventListenerFunctions.HandleMissingOpenRouterApiKeyFormSubmit,
    openSettingsButtonName: OpenOpenRouterApiKeySettings,
    openSettingsUrl: 'https://openrouter.ai/settings/keys',
    placeholder: Strings.openRouterApiKeyPlaceholder(),
    saveButtonDisabled: isSaving,
    saveButtonName: SaveOpenRouterApiKey,
    saveButtonText: isSaving ? Strings.saving() : Strings.save(),
  })
}
