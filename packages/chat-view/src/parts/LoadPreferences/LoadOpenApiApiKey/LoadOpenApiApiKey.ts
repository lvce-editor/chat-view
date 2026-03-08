import * as Preferences from '../../Preferences/Preferences.ts'

export const loadOpenApiApiKey = async (): Promise<string> => {
  try {
    const savedOpenApiKey = await Preferences.get('secrets.openApiKey')
    if (typeof savedOpenApiKey === 'string' && savedOpenApiKey) {
      return savedOpenApiKey
    }
    const legacySavedOpenApiApiKey = await Preferences.get('secrets.openApiApiKey')
    if (typeof legacySavedOpenApiApiKey === 'string' && legacySavedOpenApiApiKey) {
      return legacySavedOpenApiApiKey
    }
    const legacySavedOpenAiApiKey = await Preferences.get('secrets.openAiApiKey')
    return typeof legacySavedOpenAiApiKey === 'string' ? legacySavedOpenAiApiKey : ''
  } catch {
    return ''
  }
}
