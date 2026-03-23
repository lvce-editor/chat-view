import type { ChatState } from '../ChatState/ChatState.ts'

export const getAuthState = (state: ChatState): unknown => {
  const {
    authAccessToken,
    authEnabled,
    authErrorMessage,
    authRefreshToken,
    authStatus,
    backendUrl,
    userName,
    userSubscriptionPlan,
    userUsedTokens,
  } = state

  return {
    authAccessToken,
    authEnabled,
    authErrorMessage,
    authRefreshToken,
    authStatus,
    backendUrl,
    userName,
    userSubscriptionPlan,
    userUsedTokens,
  }
}
