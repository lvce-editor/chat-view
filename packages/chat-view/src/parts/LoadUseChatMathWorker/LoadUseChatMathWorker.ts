import * as Preferences from '../Preferences/Preferences.ts'

export const loadUseChatMathWorker = async (): Promise<boolean> => {
  try {
    const savedUseChatMathWorker = await Preferences.get('chatView.useChatMathWorker')
    return typeof savedUseChatMathWorker === 'boolean' ? savedUseChatMathWorker : true
  } catch {
    return true
  }
}
