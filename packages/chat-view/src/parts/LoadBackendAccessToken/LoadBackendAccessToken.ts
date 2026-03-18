import * as Preferences from '../Preferences/Preferences.ts'

export const loadBackendAccessToken = async (): Promise<string> => {
  try {
    const savedAccessToken = await Preferences.get('secrets.chatBackendAccessToken')
    return typeof savedAccessToken === 'string' ? savedAccessToken : ''
  } catch {
    return ''
  }
}
