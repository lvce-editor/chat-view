import * as Preferences from '../../Preferences/Preferences.ts'

export const loadUseChatNetworkWorkerForRequests = async (): Promise<boolean> => {
  try {
    const savedUseChatNetworkWorkerForRequests = await Preferences.get('chatView.useChatNetworkWorkerForRequests')
    return typeof savedUseChatNetworkWorkerForRequests === 'boolean' ? savedUseChatNetworkWorkerForRequests : false
  } catch {
    return false
  }
}
