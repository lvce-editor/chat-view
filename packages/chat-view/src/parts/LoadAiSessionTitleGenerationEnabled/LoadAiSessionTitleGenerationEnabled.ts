import * as Preferences from '../Preferences/Preferences.ts'

export const loadAiSessionTitleGenerationEnabled = async (): Promise<boolean> => {
  try {
    const savedAiSessionTitleGenerationEnabled = await Preferences.get('chatView.aiSessionTitleGenerationEnabled')
    return typeof savedAiSessionTitleGenerationEnabled === 'boolean' ? savedAiSessionTitleGenerationEnabled : false
  } catch {
    return false
  }
}
