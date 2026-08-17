import * as Preferences from '../Preferences/Preferences.ts'

export const loadModelsBuiltinEnabled = async (): Promise<boolean> => {
  try {
    const savedModelsBuiltinEnabled = await Preferences.get('chat.models.builtin')
    return typeof savedModelsBuiltinEnabled === 'boolean' ? savedModelsBuiltinEnabled : true
  } catch {
    return true
  }
}
