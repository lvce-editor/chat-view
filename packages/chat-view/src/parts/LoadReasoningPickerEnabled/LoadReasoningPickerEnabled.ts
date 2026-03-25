import * as Preferences from '../Preferences/Preferences.ts'

export const loadReasoningPickerEnabled = async (): Promise<boolean> => {
  try {
    const savedReasoningPickerEnabled = await Preferences.get('chatView.reasoningPickerEnabled')
    return typeof savedReasoningPickerEnabled === 'boolean' ? savedReasoningPickerEnabled : false
  } catch {
    return false
  }
}
