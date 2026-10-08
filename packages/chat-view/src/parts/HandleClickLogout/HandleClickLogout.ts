import { AuthWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as AuthAccessToken from '../AuthAccessToken/AuthAccessToken.ts'
import { getLoggedOutBackendAuthState, logoutFromBackend } from '../BackendAuth/BackendAuth.ts'
import { handleAuthStateChange } from '../HandleAuthStateChange/HandleAuthStateChange.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export const handleClickLogout = async (state: ChatState): Promise<ChatState> => {
  const loggingOutState: ChatState = {
    ...state,
    authErrorMessage: '',
    userState: 'loggingOut',
  }
  if (state.uid) {
    set(state.uid, state, loggingOutState)
    await RendererWorker.invoke('Chat.rerender')
  }
  if (state.useAuthWorker) {
    const authState = await AuthWorker.logout({ backendUrl: state.backendUrl })
    return handleAuthStateChange(loggingOutState, authState)
  }
  try {
    await logoutFromBackend(state.backendUrl)
  } finally {
    AuthAccessToken.clear(state.uid)
  }
  const { authAccessToken: _authAccessToken, ...safeAuthState } = getLoggedOutBackendAuthState()
  return {
    ...loggingOutState,
    ...safeAuthState,
  }
}
