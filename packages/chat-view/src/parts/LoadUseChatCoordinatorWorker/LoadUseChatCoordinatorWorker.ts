import * as Preferences from '../Preferences/Preferences.ts'

export const loadUseChatCoordinatorWorker = async (): Promise<boolean> => {
  try {
    const savedUseChatCoordinatorWorker = await Preferences.get('chatView.useChatCoordinatorWorker')
    return typeof savedUseChatCoordinatorWorker === 'boolean' ? savedUseChatCoordinatorWorker : false
  } catch {
    return false
  }
}
