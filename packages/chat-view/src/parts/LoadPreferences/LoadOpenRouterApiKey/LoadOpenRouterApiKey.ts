import * as Preferences from '../../Preferences/Preferences.ts'

export const loadOpenRouterApiKey = async (): Promise<string> => {
  try {
    const savedOpenRouterApiKey = await Preferences.get('secrets.openRouterApiKey')
    return typeof savedOpenRouterApiKey === 'string' ? savedOpenRouterApiKey : ''
  } catch {
    return ''
  }
}