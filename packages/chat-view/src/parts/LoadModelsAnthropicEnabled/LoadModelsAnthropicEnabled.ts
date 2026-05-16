import * as Preferences from '../Preferences/Preferences.ts'

export const loadModelsAnthropicEnabled = async (): Promise<boolean> => {
  try {
    const savedModelsAnthropicEnabled = await Preferences.get('chat.models.anthropic')
    return typeof savedModelsAnthropicEnabled === 'boolean' ? savedModelsAnthropicEnabled : false
  } catch {
    return false
  }
}
