import type { ChatState } from '../ChatState/ChatState.ts'
import * as Preferences from '../Preferences/Preferences.ts'

export const setUseOwnBackend = async (state: ChatState, useOwnBackend: boolean, persist = true): Promise<ChatState> => {
  if (persist) {
    await Preferences.update({
      'chat.useOwnBackend': useOwnBackend,
    })
  }

  return {
    ...state,
    useOwnBackend,
  }
}
