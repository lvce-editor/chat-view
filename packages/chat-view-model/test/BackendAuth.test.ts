import { expect, test } from '@jest/globals'
import * as BackendAuth from '../src/parts/BackendAuth/BackendAuth.ts'
import * as MockBackendAuth from '../src/parts/MockBackendAuth/MockBackendAuth.ts'

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

test('syncBackendAuth should use pending mock refresh response', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    throw new Error('fetch should not be called when mock refresh response is pending')
  }) as typeof globalThis.fetch

  MockBackendAuth.setNextRefreshResponse({
    delay: 0,
    response: {
      accessToken: 'access-token-mock',
      subscriptionPlan: 'pro',
      usedTokens: 7,
      userName: 'mock-user',
    },
    type: 'success',
  })

  try {
    const result = await BackendAuth.syncBackendAuth('https://backend.example.com')
    expect(result).toEqual({
      authAccessToken: 'access-token-mock',
      authErrorMessage: '',
      userName: 'mock-user',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 7,
    })
  } finally {
    MockBackendAuth.clear()
    globalThis.fetch = originalFetch
  }
})
