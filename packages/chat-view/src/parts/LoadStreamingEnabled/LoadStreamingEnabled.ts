import * as Preferences from '../Preferences/Preferences.ts'

export const loadStreamingEnabled = async (): Promise<boolean> => {
  try {
    const savedStreamingEnabled = await Preferences.get('chatView.streamingEnabled')
    return typeof savedStreamingEnabled === 'boolean' ? savedStreamingEnabled : true
  } catch {
    return true
  }
}
