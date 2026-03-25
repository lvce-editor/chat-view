import type { ChatState } from '../ChatState/ChatState.ts'
import * as Preferences from '../Preferences/Preferences.ts'

 
export const setUseChatMathWorker = async (state: ChatState, useChatMathWorker: boolean, persist = true): Promise<ChatState> => {
  if (persist) {
    await Preferences.update({
      'chatView.useChatMathWorker': useChatMathWorker,
    })
  }

  return {
    ...state,
    useChatMathWorker,
  }
}
