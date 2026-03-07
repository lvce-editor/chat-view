import * as Preferences from '../Preferences/Preferences.ts'

export const loadPreferences = async (): Promise<{ openApiApiKey: string; openRouterApiKey: string }> => {
  let openApiApiKey = ''
  try {
    const savedOpenApiKey = await Preferences.get('secrets.openApiKey')
    if (typeof savedOpenApiKey === 'string' && savedOpenApiKey) {
      openApiApiKey = savedOpenApiKey
    } else {
      const legacySavedOpenApiApiKey = await Preferences.get('secrets.openApiApiKey')
      if (typeof legacySavedOpenApiApiKey === 'string' && legacySavedOpenApiApiKey) {
        openApiApiKey = legacySavedOpenApiApiKey
      } else {
        const legacySavedOpenAiApiKey = await Preferences.get('secrets.openAiApiKey')
        openApiApiKey = typeof legacySavedOpenAiApiKey === 'string' ? legacySavedOpenAiApiKey : ''
      }
    }
  } catch {
    openApiApiKey = ''
  }

  let openRouterApiKey = ''
  try {
    const savedOpenRouterApiKey = await Preferences.get('secrets.openRouterApiKey')
    openRouterApiKey = typeof savedOpenRouterApiKey === 'string' ? savedOpenRouterApiKey : ''
  } catch {
    openRouterApiKey = ''
  }

  return {
    openApiApiKey,
    openRouterApiKey,
  }
}
