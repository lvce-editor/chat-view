import * as Preferences from '../Preferences/Preferences.ts'

export const loadEmitStreamingFunctionCallEvents = async (): Promise<boolean> => {
  try {
    const savedEmitStreamingFunctionCallEvents = await Preferences.get('chatView.emitStreamingFunctionCallEvents')
    return typeof savedEmitStreamingFunctionCallEvents === 'boolean' ? savedEmitStreamingFunctionCallEvents : false
  } catch {
    return false
  }
}
