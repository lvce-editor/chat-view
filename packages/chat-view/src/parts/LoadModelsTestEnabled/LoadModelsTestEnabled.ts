import * as Preferences from '../Preferences/Preferences.ts'

export const loadModelsTestEnabled = async (): Promise<boolean> => {
  try {
    const savedModelsTestEnabled = await Preferences.get('chat.models.test')
    return typeof savedModelsTestEnabled === 'boolean' ? savedModelsTestEnabled : true
  } catch {
    return true
  }
}
