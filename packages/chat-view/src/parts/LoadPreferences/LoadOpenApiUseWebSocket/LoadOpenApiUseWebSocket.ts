import * as Preferences from '../../Preferences/Preferences.ts'

export const loadOpenApiUseWebSocket = async (): Promise<boolean> => {
  try {
    const savedOpenApiUseWebSocket = await Preferences.get('chatView.openApiUseWebSocket')
    return typeof savedOpenApiUseWebSocket === 'boolean' ? savedOpenApiUseWebSocket : false
  } catch {
    return false
  }
}
