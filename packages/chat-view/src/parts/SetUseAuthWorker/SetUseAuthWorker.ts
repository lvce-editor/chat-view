import type { ChatState } from '../ChatState/ChatState.ts'
import * as Preferences from '../Preferences/Preferences.ts'

export const setUseAuthWorker = async (state: ChatState, useAuthWorker: boolean, persist = true): Promise<ChatState> => {
  if (persist) {
    await Preferences.update({
      'chatView.useAuthWorker': useAuthWorker,
    })
  }

  return {
    ...state,
    useAuthWorker,
  }
}