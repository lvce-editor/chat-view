import { expect, test } from '@jest/globals'
import * as BackendAuth from '../src/parts/BackendAuth/BackendAuth.ts'

test('syncBackendAuth should return logged in state when backend refresh succeeds', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    return {
      json: async () => ({
        accessToken: 'access-token-1',
        subscriptionPlan: 'pro',
        usedTokens: 42,
        userName: 'test-user',
      }),
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const result = await BackendAuth.syncBackendAuth('https://backend.example.com')
    expect(result).toEqual({
      authAccessToken: 'access-token-1',
      authErrorMessage: '',
      userName: 'test-user',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 42,
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('syncBackendAuth should return logged out state for unauthorized response', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    return {
      ok: false,
      status: 401,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const result = await BackendAuth.syncBackendAuth('https://backend.example.com')
    expect(result).toEqual({
      authAccessToken: '',
      authErrorMessage: '',
      userName: '',
      userState: 'loggedOut',
      userSubscriptionPlan: '',
      userUsedTokens: 0,
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('waitForBackendLogin should retry until backend refresh succeeds', async () => {
  const originalFetch = globalThis.fetch
  let callCount = 0
  globalThis.fetch = (async () => {
    callCount++
    if (callCount === 1) {
      return {
        ok: false,
        status: 401,
      } as Response
    }
    return {
      json: async () => ({
        accessToken: 'access-token-2',
        userName: 'second-user',
      }),
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch

  try {
    const result = await BackendAuth.waitForBackendLogin('https://backend.example.com', 100, 0)
    expect(result.authAccessToken).toBe('access-token-2')
    expect(result.userName).toBe('second-user')
    expect(result.userState).toBe('loggedIn')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('logoutFromBackend should post to backend logout endpoint', async () => {
  const originalFetch = globalThis.fetch
  const fetchCalls: Array<readonly [string, RequestInit | undefined]> = []
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    fetchCalls.push([String(input), init])
    return {
      ok: true,
      status: 204,
    } as Response
  }) as typeof globalThis.fetch

  try {
    await BackendAuth.logoutFromBackend('https://backend.example.com')
    expect(fetchCalls).toEqual([
      [
        'https://backend.example.com/auth/logout',
        {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
          method: 'POST',
        },
      ],
    ])
  } finally {
    globalThis.fetch = originalFetch
  }
})
