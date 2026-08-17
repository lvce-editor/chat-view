import * as Preferences from '../Preferences/Preferences.ts'

export const loadModelsOpenAiEnabled = async (): Promise<boolean> => {
  try {
    const savedModelsOpenAiEnabled = await Preferences.get('chat.models.openai')
    return typeof savedModelsOpenAiEnabled === 'boolean' ? savedModelsOpenAiEnabled : false
  } catch {
    return false
  }
}
