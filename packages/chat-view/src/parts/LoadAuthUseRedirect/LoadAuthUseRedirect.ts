import * as Preferences from '../Preferences/Preferences.ts'

export const loadAuthUseRedirect = async (): Promise<boolean> => {
  try {
    const savedAuthUseRedirect = await Preferences.get('chat.authUseRedirect')
    return typeof savedAuthUseRedirect === 'boolean' ? savedAuthUseRedirect : true
  } catch {
    return true
  }
}
