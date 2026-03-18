import * as Preferences from '../Preferences/Preferences.ts'

export const loadAuthEnabled = async (): Promise<boolean> => {
  try {
    const savedAuthEnabled = await Preferences.get('chat.authEnabled')
    return typeof savedAuthEnabled === 'boolean' ? savedAuthEnabled : false
  } catch {
    return false
  }
}
