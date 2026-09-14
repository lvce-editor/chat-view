import type { ChatState } from '../ChatState/ChatState.ts'
import * as AuthAccessToken from '../AuthAccessToken/AuthAccessToken.ts'

export const getAuthState = (state: ChatState): unknown => {
  const { authEnabled, authErrorMessage, backendUrl, userName, userState, userSubscriptionPlan, userUsedTokens } = state

  return {
    authAccessToken: AuthAccessToken.get(state.uid),
    authEnabled,
    authErrorMessage,
    backendUrl,
    userName,
    userState,
    userSubscriptionPlan,
    userUsedTokens,
  }
}
