import * as Preferences from '../Preferences/Preferences.ts'

export const loadChatHistoryEnabled = async (): Promise<boolean> => {
  try {
    const savedChatHistoryEnabled = await Preferences.get('chat.chatHistoryEnabled')
    return typeof savedChatHistoryEnabled === 'boolean' ? savedChatHistoryEnabled : true
  } catch {
    return true
  }
}
