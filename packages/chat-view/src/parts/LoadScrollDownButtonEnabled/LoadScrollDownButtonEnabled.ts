import * as Preferences from '../Preferences/Preferences.ts'

export const loadScrollDownButtonEnabled = async (): Promise<boolean> => {
  try {
    const savedScrollDownButtonEnabled = await Preferences.get('chatView.scrollDownButtonEnabled')
    return typeof savedScrollDownButtonEnabled === 'boolean' ? savedScrollDownButtonEnabled : false
  } catch {
    return false
  }
}
