import type { ChatState } from '../ChatState/ChatState.ts'

export const getAuthState = (state: ChatState): unknown => {
  return {
    authAccessToken: state.authAccessToken,
    authEnabled: state.authEnabled,
    authErrorMessage: state.authErrorMessage,
    authRefreshToken: state.authRefreshToken,
    authStatus: state.authStatus,
    backendUrl: state.backendUrl,
    userName: state.userName,
    userSubscriptionPlan: state.userSubscriptionPlan,
    userUsedTokens: state.userUsedTokens,
  }
}
