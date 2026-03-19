import * as Preferences from '../Preferences/Preferences.ts'

export const loadSearchEnabled = async (): Promise<boolean> => {
  try {
    const savedSearchEnabled = await Preferences.get('chatView.searchEnabled')
    return typeof savedSearchEnabled === 'boolean' ? savedSearchEnabled : false
  } catch {
    return false
  }
}
