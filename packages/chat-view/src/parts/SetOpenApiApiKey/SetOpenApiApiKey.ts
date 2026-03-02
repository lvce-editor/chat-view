import type { ChatState } from '../ChatState/ChatState.ts'
import * as Preferences from '../Preferences/Preferences.ts'

export const setOpenApiApiKey = async (state: ChatState, openApiApiKey: string, persist = true): Promise<ChatState> => {
  if (persist) {
    await Preferences.update({
      'secrets.openApiKey': openApiApiKey,
    })
  }

  return {
    ...state,
    openApiApiKey,
    openApiApiKeyInput: openApiApiKey,
  }
}
