import * as Preferences from '../Preferences/Preferences.ts'

export const loadBackendRefreshToken = async (): Promise<string> => {
  try {
    const savedRefreshToken = await Preferences.get('secrets.chatBackendRefreshToken')
    return typeof savedRefreshToken === 'string' ? savedRefreshToken : ''
  } catch {
    return ''
  }
}
