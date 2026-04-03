import type { ChatState } from '../ChatState/ChatState.ts'

export const getAuthState = (state: ChatState): unknown => {
  const { authAccessToken, authEnabled, authErrorMessage, authMaxDelay, backendUrl, userName, userState, userSubscriptionPlan, userUsedTokens } =
    state

  return {
    authAccessToken,
    authEnabled,
    authErrorMessage,
    authMaxDelay,
    backendUrl,
    userName,
    userState,
    userSubscriptionPlan,
    userUsedTokens,
  }
}
