import type { ChatState } from '../ChatState/ChatState.ts'
import * as Preferences from '../Preferences/Preferences.ts'

export const handleClickSaveOpenRouterApiKey = async (state: ChatState): Promise<ChatState> => {
  const openRouterApiKey = state.openRouterApiKeyInput.trim()
  if (!openRouterApiKey) {
    return state
  }
  await Preferences.update({
    'secrets.openRouterApiKey': openRouterApiKey,
  })
  return {
    ...state,
    openRouterApiKey,
  }
}
