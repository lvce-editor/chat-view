import * as Preferences from '../Preferences/Preferences.ts'

export const loadRunModePickerEnabled = async (): Promise<boolean> => {
  try {
    const savedRunModePickerEnabled = await Preferences.get('chatView.runModePickerEnabled')
    return typeof savedRunModePickerEnabled === 'boolean' ? savedRunModePickerEnabled : true
  } catch {
    return true
  }
}
