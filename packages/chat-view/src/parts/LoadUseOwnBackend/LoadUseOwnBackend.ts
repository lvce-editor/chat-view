import * as Preferences from '../Preferences/Preferences.ts'

export const loadUseOwnBackend = async (): Promise<boolean> => {
  try {
    const savedUseOwnBackend = await Preferences.get('chat.useOwnBackend')
    return typeof savedUseOwnBackend === 'boolean' ? savedUseOwnBackend : false
  } catch {
    return false
  }
}