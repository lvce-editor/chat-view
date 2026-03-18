import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as Preferences from '../Preferences/Preferences.ts'

export const handleClickLogout = async (state: ChatState): Promise<ChatState> => {
  try {
    await RendererWorker.invoke('Auth.logout', state.backendUrl)
  } catch {
    // Ignore logout bridge errors and still clear local auth state.
  }
  await Preferences.update({
    'secrets.chatBackendAccessToken': '',
    'secrets.chatBackendRefreshToken': '',
  })
  return {
    ...state,
    authAccessToken: '',
    authErrorMessage: '',
    authRefreshToken: '',
    authStatus: 'signed-out',
    userName: '',
    userSubscriptionPlan: '',
    userUsedTokens: 0,
  }
}
