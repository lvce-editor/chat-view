import * as Preferences from '../Preferences/Preferences.ts'

export const defaultBackendUrl = 'https://lvce-editor.dev'

export const loadBackendUrl = async (): Promise<string> => {
  try {
    const savedBackendUrl = await Preferences.get('chat.backendUrl')
    return typeof savedBackendUrl === 'string' && savedBackendUrl ? savedBackendUrl : defaultBackendUrl
  } catch {
    return defaultBackendUrl
  }
}
