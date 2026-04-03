import type { BackendAuthState } from '../BackendAuthState/BackendAuthState.ts'
import { defaultAuthMaxDelay } from '../../DefaultAuthMaxDelay/DefaultAuthMaxDelay.ts'
import * as MockBackendAuth from '../../MockBackendAuth/MockBackendAuth.ts'
import { getBackendRefreshUrl } from '../GetBackendRefreshUrl/GetBackendRefreshUrl.ts'
import { getLoggedOutBackendAuthState } from '../GetLoggedOutBackendAuthState/GetLoggedOutBackendAuthState.ts'
import { parseBackendAuthResponse } from '../ParseBackendAuthResponse/ParseBackendAuthResponse.ts'

const timeoutErrorMessage = 'Backend authentication timed out.'
const backendUnavailableErrorMessage = 'Auth backend error or unavailable.'

const isAbortError = (error: unknown): boolean => {
  return error instanceof Error && error.name === 'AbortError'
}

const isBackendUnavailableError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false
  }
  if (error instanceof TypeError) {
    return true
  }
  return error.message === 'Failed to fetch'
}

const getAbortError = (): Error => {
  return Object.assign(new Error('The operation was aborted.'), {
    name: 'AbortError',
  })
}

const getAbortSignal = (timeoutMs: number): readonly [AbortSignal, () => void] => {
  const abortController = new AbortController()
  const timeout = setTimeout(() => {
    abortController.abort(getAbortError())
  }, timeoutMs)
  return [
    abortController.signal,
    (): void => {
      clearTimeout(timeout)
    },
  ]
}

const getAuthStateFromPayload = (payload: unknown): BackendAuthState => {
  const parsed = parseBackendAuthResponse(payload)
  if (parsed.authErrorMessage) {
    return getLoggedOutBackendAuthState(parsed.authErrorMessage)
  }
  if (!parsed.authAccessToken) {
    return getLoggedOutBackendAuthState()
  }
  return parsed
}

export const syncBackendAuth = async (backendUrl: string, timeoutMs = defaultAuthMaxDelay): Promise<BackendAuthState> => {
  if (!backendUrl) {
    return getLoggedOutBackendAuthState('Backend URL is missing.')
  }
  const [signal, clearTimeoutSignal] = getAbortSignal(timeoutMs)
  try {
    if (MockBackendAuth.hasPendingMockRefreshResponse()) {
      const payload = await MockBackendAuth.consumeNextRefreshResponse(signal)
      return getAuthStateFromPayload(payload)
    }
    const response = await fetch(getBackendRefreshUrl(backendUrl), {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
      method: 'POST',
      signal,
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
    return getAuthStateFromPayload(payload)
  } catch (error) {
    if (isAbortError(error)) {
      return getLoggedOutBackendAuthState(timeoutErrorMessage)
    }
    if (isBackendUnavailableError(error)) {
      return getLoggedOutBackendAuthState(backendUnavailableErrorMessage)
    }
    const authErrorMessage = error instanceof Error && error.message ? error.message : 'Backend authentication failed.'
    return getLoggedOutBackendAuthState(authErrorMessage)
  } finally {
    clearTimeoutSignal()
  }
}
