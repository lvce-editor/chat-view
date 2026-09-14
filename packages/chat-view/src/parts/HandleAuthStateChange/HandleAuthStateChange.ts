import type { ChatState } from '../ChatState/ChatState.ts'
import * as AuthAccessToken from '../AuthAccessToken/AuthAccessToken.ts'

export const handleAuthStateChange = (state: ChatState, authState: Partial<ChatState> & { readonly authAccessToken?: string }): ChatState => {
  if (typeof authState.authAccessToken === 'string') {
    AuthAccessToken.set(state.uid, authState.authAccessToken)
  }
  return {
    ...state,
    authErrorMessage: typeof authState.authErrorMessage === 'string' ? authState.authErrorMessage : state.authErrorMessage,
    userName: typeof authState.userName === 'string' ? authState.userName : state.userName,
    userState: typeof authState.userState === 'string' ? authState.userState : state.userState,
    userSubscriptionPlan: typeof authState.userSubscriptionPlan === 'string' ? authState.userSubscriptionPlan : state.userSubscriptionPlan,
    userUsedTokens: typeof authState.userUsedTokens === 'number' ? authState.userUsedTokens : state.userUsedTokens,
  }
}
