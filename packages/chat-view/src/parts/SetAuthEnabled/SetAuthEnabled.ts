import type { ChatState } from '../ChatState/ChatState.ts'

export const setAuthEnabled = (state: ChatState, authEnabled: boolean): ChatState => {
  return {
    ...state,
    authAccessToken: authEnabled ? state.authAccessToken : '',
    authEnabled,
    authErrorMessage: authEnabled ? state.authErrorMessage : '',
    userName: authEnabled ? state.userName : '',
    userState: authEnabled ? state.userState : 'loggedOut',
    userSubscriptionPlan: authEnabled ? state.userSubscriptionPlan : '',
    userUsedTokens: authEnabled ? state.userUsedTokens : 0,
  }
}
