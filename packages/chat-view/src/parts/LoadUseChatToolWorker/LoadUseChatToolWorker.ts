import * as Preferences from '../Preferences/Preferences.ts'

export const loadUseChatToolWorker = async (): Promise<boolean> => {
  try {
    const savedUseChatToolWorker = await Preferences.get('chatView.useChatToolWorker')
    return typeof savedUseChatToolWorker === 'boolean' ? savedUseChatToolWorker : false
  } catch {
    return false
  }
}
