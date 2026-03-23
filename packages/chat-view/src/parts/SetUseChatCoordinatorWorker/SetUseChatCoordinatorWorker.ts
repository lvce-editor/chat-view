import type { ChatState } from '../ChatState/ChatState.ts'
import * as Preferences from '../Preferences/Preferences.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const setUseChatCoordinatorWorker = async (state: ChatState, useChatCoordinatorWorker: boolean, persist = true): Promise<ChatState> => {
  if (persist) {
    await Preferences.update({
      'chatView.useChatCoordinatorWorker': useChatCoordinatorWorker,
    })
  }

  return {
    ...state,
    useChatCoordinatorWorker,
  }
}
