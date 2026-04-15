import * as Preferences from '../Preferences/Preferences.ts'

export const loadSessionPinningEnabled = async (): Promise<boolean> => {
  try {
    const savedSessionPinningEnabled = await Preferences.get('chat.sessionPinningEnabled')
    return typeof savedSessionPinningEnabled === 'boolean' ? savedSessionPinningEnabled : true
  } catch {
    return true
  }
}import * as Preferences from '../Preferences/Preferences.ts'

export const loadSessionPinningEnabled = async (): Promise<boolean> => {
  try {
    const savedSessionPinningEnabled = await Preferences.get('chat.sessionPinningEnabled')
    return typeof savedSessionPinningEnabled === 'boolean' ? savedSessionPinningEnabled : true
  } catch {
    return true
  }
}
