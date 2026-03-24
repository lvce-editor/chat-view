import type { ChatState } from '../ChatState/ChatState.ts'
import * as Preferences from '../Preferences/Preferences.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const setOpenRouterApiKey = async (state: ChatState, openRouterApiKey: string, persist = true): Promise<ChatState> => {
  if (persist) {
    await Preferences.update({
      'secrets.openRouterApiKey': openRouterApiKey,
    })
  }

  return {
    ...state,
    openRouterApiKey,
    openRouterApiKeyInput: openRouterApiKey,
  }
}
