import type { ChatState } from '../ChatState/ChatState.ts'
import * as Preferences from '../Preferences/Preferences.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const setUseChatNetworkWorkerForRequests = async (
  state: ChatState,
  useChatNetworkWorkerForRequests: boolean,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
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
