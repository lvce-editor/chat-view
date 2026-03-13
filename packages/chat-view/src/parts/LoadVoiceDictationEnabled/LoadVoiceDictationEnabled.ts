import * as Preferences from '../Preferences/Preferences.ts'

export const loadVoiceDictationEnabled = async (): Promise<boolean> => {
  try {
    const savedVoiceDictationEnabled = await Preferences.get('chatView.voiceDictationEnabled')
    return typeof savedVoiceDictationEnabled === 'boolean' ? savedVoiceDictationEnabled : false
  } catch {
    return false
  }
}
