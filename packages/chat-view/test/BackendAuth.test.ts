import { RendererWorker } from '@lvce-editor/rpc-registry'
import { expect, test } from '@jest/globals'
import * as BackendAuth from '../src/parts/BackendAuth/BackendAuth.ts'
import * as MockBackendAuth from '../src/parts/MockBackendAuth/MockBackendAuth.ts'

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

test('waitForElectronBackendLogin should wait for oauth code before syncing backend auth', async () => {
  const originalFetch = globalThis.fetch
  const fetchCalls: Array<readonly [string, Readonly<RequestInit> | undefined]> = []
  globalThis.fetch = (async (...args: readonly unknown[]) => {
    const [input, init] = args as readonly [unknown, Readonly<RequestInit> | undefined]
    fetchCalls.push([getRequestUrl(input), init])
    return {
      json: async () => ({
        accessToken: 'access-token-electron',
        subscriptionPlan: 'pro',
        usedTokens: 11,
        userName: 'electron-user',
      }),
      ok: true,
      status: 200,
    } as Response
  }) as typeof globalThis.fetch
  let codeCallCount = 0
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'OAuthServer.getCode': async () => {
      codeCallCount++
      return codeCallCount === 1 ? '' : 'code-1'
    },
  })

  try {
    const result = await BackendAuth.waitForElectronBackendLogin('https://backend.example.com', 123, 100, 0)
    expect(result).toEqual({
      authAccessToken: 'access-token-electron',
      authErrorMessage: '',
      userName: 'electron-user',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 11,
    })
    expect(mockRendererRpc.invocations).toEqual([
      ['OAuthServer.getCode', '123'],
      ['OAuthServer.getCode', '123'],
    ])
    expect(fetchCalls).toEqual([
      [
        'https://backend.example.com/auth/refresh',
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

test('getBackendLoginUrl should include redirect_uri from current location', async () => {
  const originalLocation = Object.getOwnPropertyDescriptor(globalThis, 'location')
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    value: {
      href: 'https://chat.example.com/current?tab=auth#login',
    },
  })

  try {
    const result = await BackendAuth.getBackendLoginUrl('https://backend.example.com')
    expect(result).toBe('https://backend.example.com/login?redirect_uri=https%3A%2F%2Fchat.example.com%2Fcurrent%3Ftab%3Dauth%23login')
  } finally {
    if (originalLocation) {
      Object.defineProperty(globalThis, 'location', originalLocation)
    } else {
      Reflect.deleteProperty(globalThis, 'location')
    }
  }
})

test('getBackendLoginUrl should prefer explicit redirect_uri override', async () => {
  const result = await BackendAuth.getBackendLoginUrl('https://backend.example.com', 0, 0, 'http://localhost:4567')
  expect(result).toBe('https://backend.example.com/login?redirect_uri=http%3A%2F%2Flocalhost%3A4567')
})

test('getBackendLoginUrl should use localhost oauth redirect on electron', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'OAuthServer.create': async () => 4567,
  })

  const result = await BackendAuth.getBackendLoginUrl('https://backend.example.com', 2, 123)

  expect(result).toBe('https://backend.example.com/login?redirect_uri=http%3A%2F%2Flocalhost%3A4567')
  expect(mockRendererRpc.invocations).toEqual([['OAuthServer.create', '123']])
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
