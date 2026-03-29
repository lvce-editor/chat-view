import type { AuthUserState } from '../AuthUserState/AuthUserState.ts'
import { delay } from '../Delay/Delay.ts'

interface BackendAuthResponse {
  readonly accessToken?: string
  readonly error?: string
  readonly subscriptionPlan?: string
  readonly usedTokens?: number
  readonly userName?: string
}

export interface BackendAuthState {
  readonly authAccessToken: string
  readonly authErrorMessage: string
  readonly userName: string
  readonly userState: AuthUserState
  readonly userSubscriptionPlan: string
  readonly userUsedTokens: number
}

const trailingSlashesRegex = /\/+$/

const isObject = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object'
}

const isBackendAuthResponse = (value: unknown): value is BackendAuthResponse => {
  return isObject(value)
}

const trimTrailingSlashes = (value: string): string => {
  return value.replace(trailingSlashesRegex, '')
}

const getBackendAuthUrl = (backendUrl: string, path: string): string => {
  return `${trimTrailingSlashes(backendUrl)}${path}`
}

const getString = (value: unknown, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback
}

const getNumber = (value: unknown, fallback = 0): number => {
  return typeof value === 'number' ? value : fallback
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

export const getBackendLoginUrl = (backendUrl: string): string => {
  return getBackendAuthUrl(backendUrl, '/auth/login')
}

const getBackendRefreshUrl = (backendUrl: string): string => {
  return getBackendAuthUrl(backendUrl, '/auth/refresh')
}

const getBackendLogoutUrl = (backendUrl: string): string => {
  return getBackendAuthUrl(backendUrl, '/auth/logout')
}

const toBackendAuthState = (value: BackendAuthResponse): BackendAuthState => {
  return {
    authAccessToken: getString(value.accessToken),
    authErrorMessage: getString(value.error),
    userName: getString(value.userName),
    userState: value.accessToken ? 'loggedIn' : 'loggedOut',
    userSubscriptionPlan: getString(value.subscriptionPlan),
    userUsedTokens: getNumber(value.usedTokens),
  }
}

const parseBackendAuthResponse = (value: unknown): BackendAuthState => {
  if (!isBackendAuthResponse(value)) {
    return getLoggedOutBackendAuthState('Backend returned an invalid authentication response.')
  }
  return toBackendAuthState(value)
}

export const syncBackendAuth = async (backendUrl: string): Promise<BackendAuthState> => {
  if (!backendUrl) {
    return getLoggedOutBackendAuthState('Backend URL is missing.')
  }
  try {
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

export const waitForBackendLogin = async (backendUrl: string, timeoutMs = 30_000, pollIntervalMs = 1_000): Promise<BackendAuthState> => {
  const deadline = Date.now() + timeoutMs
  let lastErrorMessage = ''
  while (Date.now() < deadline) {
    const authState = await syncBackendAuth(backendUrl)
    if (authState.userState === 'loggedIn') {
      return authState
    }
    if (authState.authErrorMessage) {
      lastErrorMessage = authState.authErrorMessage
    }
    await delay(pollIntervalMs)
  }
  return getLoggedOutBackendAuthState(lastErrorMessage)
}

export const logoutFromBackend = async (backendUrl: string): Promise<void> => {
  if (!backendUrl) {
    return
  }
  try {
    await fetch(getBackendLogoutUrl(backendUrl), {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
      method: 'POST',
    })
  } catch {
    // Ignore logout failures and still clear local auth state.
  }
}
