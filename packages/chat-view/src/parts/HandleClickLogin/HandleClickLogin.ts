import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as Preferences from '../Preferences/Preferences.ts'

interface LoginResponse {
  readonly accessToken?: string
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
  try {
    const response = await RendererWorker.invoke('Auth.login', state.backendUrl)
    if (!isLoginResponse(response)) {
      return {
        ...signingInState,
        authStatus: 'signed-out',
      }
    }
    const accessToken = typeof response.accessToken === 'string' ? response.accessToken : ''
    if (accessToken) {
      await Preferences.update({
        'secrets.chatBackendAccessToken': accessToken,
      })
    }
    return {
      ...signingInState,
      authAccessToken: accessToken,
      authStatus: accessToken ? 'signed-in' : 'signed-out',
      userName: typeof response.userName === 'string' ? response.userName : state.userName,
      userSubscriptionPlan: typeof response.subscriptionPlan === 'string' ? response.subscriptionPlan : state.userSubscriptionPlan,
      userUsedTokens: typeof response.usedTokens === 'number' ? response.usedTokens : state.userUsedTokens,
    }
  } catch {
    await RendererWorker.invoke('Main.openUri', `${trimTrailingSlashes(state.backendUrl)}/auth/login`)
    return signingInState
  }
}
