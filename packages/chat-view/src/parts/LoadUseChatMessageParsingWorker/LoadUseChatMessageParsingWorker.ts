import * as Preferences from '../Preferences/Preferences.ts'

export const loadUseChatMessageParsingWorker = async (): Promise<boolean> => {
  try {
    const savedUseChatMessageParsingWorker = await Preferences.get('chatView.useChatMessageParsingWorker')
    return typeof savedUseChatMessageParsingWorker === 'boolean' ? savedUseChatMessageParsingWorker : false
  } catch {
    return false
  }
}
