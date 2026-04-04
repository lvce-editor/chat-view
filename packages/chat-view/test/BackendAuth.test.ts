import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as BackendAuth from '../src/parts/BackendAuth/BackendAuth.ts'

const getRequestUrl = (input: unknown): string => {
  if (typeof input === 'string') {
    return input
  }
  if (input instanceof URL) {
    return input.href
  }
  if (input instanceof Request) {
    return input.url
  }
  return ''
}

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

test('syncBackendAuth should time out hanging backend refresh requests', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = ((...args: readonly unknown[]) => {
    const [, init] = args as readonly [unknown, Readonly<RequestInit> | undefined]
    return new Promise<Response>((resolve, reject) => {
      init?.signal?.addEventListener(
        'abort',
        () => {
          reject(Object.assign(new Error('The operation was aborted.'), { name: 'AbortError' }))
        },
        { once: true },
      )
    })
  }) as typeof globalThis.fetch

  try {
    const result = await BackendAuth.syncBackendAuth('https://backend.example.com', 10)
    expect(result).toEqual({
      authAccessToken: '',
      authErrorMessage: 'Backend authentication timed out.',
      userName: '',
      userState: 'loggedOut',
      userSubscriptionPlan: '',
      userUsedTokens: 0,
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('syncBackendAuth should return generic message for backend refresh fetch failure', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    throw new TypeError('Failed to fetch')
  }) as typeof globalThis.fetch

  try {
    const result = await BackendAuth.syncBackendAuth('https://backend.example.com', 10)
    expect(result).toEqual({
      authAccessToken: '',
      authErrorMessage: 'Auth backend error or unavailable.',
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

test('waitForBackendLogin should fail immediately when backend refresh times out', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = ((...args: readonly unknown[]) => {
    const [, init] = args as readonly [unknown, Readonly<RequestInit> | undefined]
    return new Promise<Response>((resolve, reject) => {
      init?.signal?.addEventListener(
        'abort',
        () => {
          reject(Object.assign(new Error('The operation was aborted.'), { name: 'AbortError' }))
        },
        { once: true },
      )
    })
  }) as typeof globalThis.fetch

  try {
    const result = await BackendAuth.waitForBackendLogin('https://backend.example.com', 10, 0)
    expect(result).toEqual({
      authAccessToken: '',
      authErrorMessage: 'Backend authentication timed out.',
      userName: '',
      userState: 'loggedOut',
      userSubscriptionPlan: '',
      userUsedTokens: 0,
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getBackendLoginUrl should include redirect_uri from current location', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.getHref': async () => 'https://chat.example.com/current?tab=auth#login',
  })

  const result = await BackendAuth.getBackendLoginUrl('https://backend.example.com')
  expect(result).toBe('https://backend.example.com/auth/login?redirect_uri=https%3A%2F%2Fchat.example.com%2Fcurrent%3Ftab%3Dauth%23login')
  expect(mockRpc.invocations).toEqual([['Layout.getHref']])
})

test('logoutFromBackend should post to backend logout endpoint', async () => {
  const originalFetch = globalThis.fetch
  const fetchCalls: Array<readonly [string, Readonly<RequestInit> | undefined]> = []
  globalThis.fetch = (async (...args: readonly unknown[]) => {
    const [input, init] = args as readonly [unknown, Readonly<RequestInit> | undefined]
    fetchCalls.push([getRequestUrl(input), init])
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
