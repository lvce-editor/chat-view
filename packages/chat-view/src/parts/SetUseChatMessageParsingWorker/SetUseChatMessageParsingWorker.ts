import type { ChatState } from '../ChatState/ChatState.ts'
import * as Preferences from '../Preferences/Preferences.ts'

 
export const setUseChatMessageParsingWorker = async (state: ChatState, useChatMessageParsingWorker: boolean, persist = true): Promise<ChatState> => {
  if (persist) {
    await Preferences.update({
      'chatView.useChatMessageParsingWorker': useChatMessageParsingWorker,
    })
  }

  return {
    ...state,
    useChatMessageParsingWorker,
  }
}
