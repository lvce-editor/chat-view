import type { ChatState } from '../ChatState/ChatState.ts'
import * as Preferences from '../Preferences/Preferences.ts'

export const setUseChatNetworkWorkerForRequests = async (
  state: ChatState,
  useChatNetworkWorkerForRequests: boolean,
  persist = true,
): Promise<ChatState> => {
  if (persist) {
    await Preferences.update({
      'chatView.useChatNetworkWorkerForRequests': useChatNetworkWorkerForRequests,
    })
  }

  return {
    ...state,
    useChatNetworkWorkerForRequests,
  }
}
