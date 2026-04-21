import type { AuthUserState } from '../ViewModel/ViewModel.ts'
import * as MockBackendAuth from '../MockBackendAuth/MockBackendAuth.ts'
import { isObject } from '../IsObject/IsObject.ts'

export interface BackendAuthState {
  readonly authAccessToken: string
  readonly authErrorMessage: string
  readonly userName: string
  readonly userState: AuthUserState
  readonly userSubscriptionPlan: string
  readonly userUsedTokens: number
}

export const getLoggedOutBackendAuthState = (authErrorMessage = ''): BackendAuthState => {
  return {
    authAccessToken: '',
    authErrorMessage,
    userName: '',
    userState: 'loggedOut',
    userSubscriptionPlan: '',
    userUsedTokens: 0,
  }
}

const getString = (value: unknown): string => {
  return typeof value === 'string' ? value : ''
}

const getNumber = (value: unknown): number => {
  return typeof value === 'number' ? value : 0
}

const trimTrailingSlashes = (value: string): string => {
  return value.replace(/\/+$/g, '')
}

const getBackendRefreshUrl = (backendUrl: string): string => {
  return `${trimTrailingSlashes(backendUrl)}/auth/refresh`
}

const parseBackendAuthResponse = (value: unknown): BackendAuthState => {
  if (!isObject(value)) {
    return getLoggedOutBackendAuthState('Backend returned an invalid authentication response.')
  }
  const authAccessToken = getString(Reflect.get(value, 'accessToken'))
  const authErrorMessage = getString(Reflect.get(value, 'error'))
  const userName = getString(Reflect.get(value, 'userName'))
  const userSubscriptionPlan = getString(Reflect.get(value, 'subscriptionPlan'))
  const userUsedTokens = getNumber(Reflect.get(value, 'usedTokens'))
  return {
    authAccessToken,
    authErrorMessage,
    userName,
    userState: authAccessToken ? 'loggedIn' : 'loggedOut',
    userSubscriptionPlan,
    userUsedTokens,
  }
}

export const syncBackendAuth = async (backendUrl: string): Promise<BackendAuthState> => {
  if (!backendUrl) {
    return getLoggedOutBackendAuthState('Backend URL is missing.')
  }
  try {
    if (MockBackendAuth.hasPendingMockRefreshResponse()) {
      const mockResponse = await MockBackendAuth.consumeNextRefreshResponse()
      return parseBackendAuthResponse(mockResponse)
    }
    const response = await fetch(getBackendRefreshUrl(backendUrl), {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
      method: 'POST',
    })
    if (response.status === 401 || response.status === 403) {
      return getLoggedOutBackendAuthState()
    }
    let payload: unknown = undefined
    try {
      payload = await response.json()
    } catch {
      payload = undefined
    }
    if (!response.ok) {
      const parsed = parseBackendAuthResponse(payload)
      return getLoggedOutBackendAuthState(parsed.authErrorMessage || 'Backend authentication failed.')
    }
    const parsed = parseBackendAuthResponse(payload)
    if (parsed.authErrorMessage) {
      return getLoggedOutBackendAuthState(parsed.authErrorMessage)
    }
    if (!parsed.authAccessToken) {
      return getLoggedOutBackendAuthState()
    }
    return parsed
  } catch (error) {
    const authErrorMessage = error instanceof Error && error.message ? error.message : 'Backend authentication failed.'
    return getLoggedOutBackendAuthState(authErrorMessage)
  }
}