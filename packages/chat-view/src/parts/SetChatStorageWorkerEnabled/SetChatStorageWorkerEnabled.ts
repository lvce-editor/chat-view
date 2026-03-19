import type { ChatState } from '../ChatState/ChatState.ts'
import * as ChatSessionStorage from '../ChatSessionStorage/ChatSessionStorage.ts'
import * as Preferences from '../Preferences/Preferences.ts'

export const setChatStorageWorkerEnabled = async (state: ChatState, chatStorageWorkerEnabled: boolean, persist = true): Promise<ChatState> => {
  if (persist) {
    await Preferences.update({
      'chatView.chatStorageWorkerEnabled': chatStorageWorkerEnabled,
    })
  }
  ChatSessionStorage.setChatStorageWorkerEnabled(chatStorageWorkerEnabled)

  return {
    ...state,
    chatStorageWorkerEnabled,
  }
}
