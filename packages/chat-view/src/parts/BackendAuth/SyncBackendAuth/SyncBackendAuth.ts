import type { BackendAuthState } from '../BackendAuthState/BackendAuthState.ts'
import { defaultAuthMaxDelay } from '../../DefaultAuthMaxDelay/DefaultAuthMaxDelay.ts'
import { getBackendRefreshUrl } from '../GetBackendRefreshUrl/GetBackendRefreshUrl.ts'
import { getLoggedOutBackendAuthState } from '../GetLoggedOutBackendAuthState/GetLoggedOutBackendAuthState.ts'
import * as MockBackendAuth from '../../MockBackendAuth/MockBackendAuth.ts'
import { parseBackendAuthResponse } from '../ParseBackendAuthResponse/ParseBackendAuthResponse.ts'

const timeoutErrorMessage = 'Backend authentication timed out.'

const isAbortError = (error: unknown): boolean => {
  return error instanceof Error && error.name === 'AbortError'
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
    () => {
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
    const authErrorMessage = error instanceof Error && error.message ? error.message : 'Backend authentication failed.'
    return getLoggedOutBackendAuthState(authErrorMessage)
  } finally {
    clearTimeoutSignal()
  }
}
