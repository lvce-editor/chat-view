import * as Preferences from '../Preferences/Preferences.ts'

const loadOpenApiApiKey = async (): Promise<string> => {
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

const loadOpenRouterApiKey = async (): Promise<string> => {
  try {
    const savedOpenRouterApiKey = await Preferences.get('secrets.openRouterApiKey')
    return typeof savedOpenRouterApiKey === 'string' ? savedOpenRouterApiKey : ''
  } catch {
    return ''
  }
}

export const loadPreferences = async (): Promise<{ openApiApiKey: string; openRouterApiKey: string }> => {
  const openApiApiKey = await loadOpenApiApiKey()
  const openRouterApiKey = await loadOpenRouterApiKey()

  return {
    openApiApiKey,
    openRouterApiKey,
  }
}
