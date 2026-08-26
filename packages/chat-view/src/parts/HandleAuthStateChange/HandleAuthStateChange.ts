import type { ChatState } from '../ChatState/ChatState.ts'

export const handleAuthStateChange = (state: ChatState, authState: Partial<ChatState>): ChatState => {
  return {
    ...state,
    authAccessToken: typeof authState.authAccessToken === 'string' ? authState.authAccessToken : state.authAccessToken,
    authErrorMessage: typeof authState.authErrorMessage === 'string' ? authState.authErrorMessage : state.authErrorMessage,
    userName: typeof authState.userName === 'string' ? authState.userName : state.userName,
    userState: typeof authState.userState === 'string' ? authState.userState : state.userState,
    userSubscriptionPlan: typeof authState.userSubscriptionPlan === 'string' ? authState.userSubscriptionPlan : state.userSubscriptionPlan,
    userUsedTokens: typeof authState.userUsedTokens === 'number' ? authState.userUsedTokens : state.userUsedTokens,
  }
}
