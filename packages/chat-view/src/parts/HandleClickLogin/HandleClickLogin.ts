import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as MockBackendAuth from '../MockBackendAuth/MockBackendAuth.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

interface LoginResponse {
  readonly accessToken?: string
  readonly error?: string
  readonly refreshToken?: string
  readonly subscriptionPlan?: string
  readonly usedTokens?: number
  readonly userName?: string
}

const isLoginResponse = (value: unknown): value is LoginResponse => {
  if (!value || typeof value !== 'object') {
    return false
  }
  return true
}

const trimTrailingSlashes = (value: string): string => {
  return value.replace(/\/+$/, '')
}

export const handleClickLogin = async (state: ChatState): Promise<ChatState> => {
  if (!state.backendUrl) {
    return {
      ...state,
      authErrorMessage: 'Backend URL is missing.',
      authStatus: 'signed-out',
    }
  }
  const signingInState: ChatState = {
    ...state,
    authErrorMessage: '',
    authStatus: 'signing-in',
  }
  if (state.uid) {
    set(state.uid, state, signingInState)
    await RendererWorker.invoke('Chat.rerender')
  }
  let usedMockResponse = false
  try {
    usedMockResponse = MockBackendAuth.hasPendingMockLoginResponse()
    const response = usedMockResponse
      ? await MockBackendAuth.consumeNextLoginResponse()
      : await RendererWorker.invoke('Auth.login', state.backendUrl)
    if (!isLoginResponse(response)) {
      return {
        ...signingInState,
        authErrorMessage: 'Backend returned an invalid login response.',
        authStatus: 'signed-out',
      }
    }
    if (typeof response.error === 'string' && response.error) {
      return {
        ...signingInState,
        authErrorMessage: response.error,
        authStatus: 'signed-out',
      }
    }
    const accessToken = typeof response.accessToken === 'string' ? response.accessToken : ''
    const refreshToken = typeof response.refreshToken === 'string' ? response.refreshToken : ''
    await Preferences.update({
      'secrets.chatBackendAccessToken': accessToken,
      'secrets.chatBackendRefreshToken': refreshToken,
    })
    return {
      ...signingInState,
      authAccessToken: accessToken,
      authErrorMessage: '',
      authRefreshToken: refreshToken,
      authStatus: accessToken ? 'signed-in' : 'signed-out',
      userName: typeof response.userName === 'string' ? response.userName : state.userName,
      userSubscriptionPlan: typeof response.subscriptionPlan === 'string' ? response.subscriptionPlan : state.userSubscriptionPlan,
      userUsedTokens: typeof response.usedTokens === 'number' ? response.usedTokens : state.userUsedTokens,
    }
  } catch (error) {
    const errorMessage = error instanceof Error && error.message ? error.message : 'Backend authentication failed.'
    if (!usedMockResponse) {
      await RendererWorker.invoke('Main.openUri', `${trimTrailingSlashes(state.backendUrl)}/auth/login`)
    }
    return {
      ...signingInState,
      authErrorMessage: errorMessage,
      authStatus: 'signed-out',
    }
  }
}
