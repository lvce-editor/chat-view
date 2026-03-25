import type { ChatState } from '../ChatState/ChatState.ts'
import * as Preferences from '../Preferences/Preferences.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
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
