import type { ChatState } from '../ChatState/ChatState.ts'
import * as AuthAccessToken from '../AuthAccessToken/AuthAccessToken.ts'

export const setAuthEnabled = (state: ChatState, authEnabled: boolean): ChatState => {
  if (!authEnabled) {
    AuthAccessToken.clear(state.uid)
  }
  return {
    ...state,
    authEnabled,
    authErrorMessage: authEnabled ? state.authErrorMessage : '',
    userName: authEnabled ? state.userName : '',
    userState: authEnabled ? state.userState : 'loggedOut',
    userSubscriptionPlan: authEnabled ? state.userSubscriptionPlan : '',
    userUsedTokens: authEnabled ? state.userUsedTokens : 0,
  }
}
