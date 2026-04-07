import * as Preferences from '../Preferences/Preferences.ts'

export const loadUseAuthWorker = async (): Promise<boolean> => {
  try {
    const savedUseAuthWorker = await Preferences.get('chatView.useAuthWorker')
    return typeof savedUseAuthWorker === 'boolean' ? savedUseAuthWorker : false
  } catch {
    return false
  }
}