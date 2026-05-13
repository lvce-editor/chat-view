import * as Preferences from '../Preferences/Preferences.ts'

export const loadShowModelUsageMultiplier = async (): Promise<boolean> => {
  try {
    const savedShowModelUsageMultiplier = await Preferences.get('chatView.showModelUsageMultiplier')
    return typeof savedShowModelUsageMultiplier === 'boolean' ? savedShowModelUsageMultiplier : true
  } catch {
    return true
  }
}
