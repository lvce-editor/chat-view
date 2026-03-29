import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getLoggedOutBackendAuthState, logoutFromBackend } from '../BackendAuth/BackendAuth.ts'
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
  await logoutFromBackend(state.backendUrl)
  return {
    ...loggingOutState,
    ...getLoggedOutBackendAuthState(),
  }
}
