import * as Preferences from '../Preferences/Preferences.ts'

export const loadShowChatListTime = async (): Promise<boolean> => {
  try {
    const savedShowChatListTime = await Preferences.get('chatView.showChatListTime')
    return typeof savedShowChatListTime === 'boolean' ? savedShowChatListTime : true
  } catch {
    return true
  }
}
