import * as Preferences from '../Preferences/Preferences.ts'

export const loadChatStorageWorkerEnabled = async (): Promise<boolean> => {
  try {
    const savedChatStorageWorkerEnabled = await Preferences.get('chatView.chatStorageWorkerEnabled')
    return typeof savedChatStorageWorkerEnabled === 'boolean' ? savedChatStorageWorkerEnabled : false
  } catch {
    return false
  }
}
