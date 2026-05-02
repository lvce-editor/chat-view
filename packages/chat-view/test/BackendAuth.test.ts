import { expect, test } from '@jest/globals'
import { AuthWorker, RendererWorker } from '@lvce-editor/rpc-registry'
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
  using mockAuthRpc = AuthWorker.registerMockRpc({
    'Auth.syncBackendAuth': async () => ({
      authAccessToken: 'access-token-1',
      authErrorMessage: '',
      userName: 'test-user',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 42,
    }),
  })

  const result = await BackendAuth.syncBackendAuth('https://backend.example.com')

  expect(result).toEqual({
    authAccessToken: 'access-token-1',
    authErrorMessage: '',
    userName: 'test-user',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
  })
  expect(mockAuthRpc.invocations).toEqual([['Auth.syncBackendAuth', 'https://backend.example.com']])
})

test('syncBackendAuth should return logged out state for unauthorized response', async () => {
  using mockAuthRpc = AuthWorker.registerMockRpc({
    'Auth.syncBackendAuth': async () => ({
      authAccessToken: '',
      authErrorMessage: '',
      userName: '',
      userState: 'loggedOut',
      userSubscriptionPlan: '',
      userUsedTokens: 0,
    }),
  })

  const result = await BackendAuth.syncBackendAuth('https://backend.example.com')

  expect(result).toEqual({
    authAccessToken: '',
    authErrorMessage: '',
    userName: '',
    userState: 'loggedOut',
    userSubscriptionPlan: '',
    userUsedTokens: 0,
  })
  expect(mockAuthRpc.invocations).toEqual([['Auth.syncBackendAuth', 'https://backend.example.com']])
})

test('syncBackendAuth should return mocked auth worker response', async () => {
  using mockAuthRpc = AuthWorker.registerMockRpc({
    'Auth.syncBackendAuth': async () => ({
      authAccessToken: 'access-token-mock',
      authErrorMessage: '',
      userName: 'mock-user',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 7,
    }),
  })

  const result = await BackendAuth.syncBackendAuth('https://backend.example.com')

  expect(result).toEqual({
    authAccessToken: 'access-token-mock',
    authErrorMessage: '',
    userName: 'mock-user',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 7,
  })
  expect(mockAuthRpc.invocations).toEqual([['Auth.syncBackendAuth', 'https://backend.example.com']])
})

test('syncBackendAuth should delegate to auth worker when enabled', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (): Promise<Response> => {
    throw new Error('fetch should not be called when auth worker is enabled')
  }
  using mockAuthRpc = AuthWorker.registerMockRpc({
    'Auth.syncBackendAuth': async () => ({
      authAccessToken: 'worker-token-1',
      authErrorMessage: '',
      userName: 'worker-user',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 13,
    }),
  })

  try {
    const result = await BackendAuth.syncBackendAuth('https://backend.example.com', true)
    expect(result).toEqual({
      authAccessToken: 'worker-token-1',
      authErrorMessage: '',
      userName: 'worker-user',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 13,
    })
    expect(mockAuthRpc.invocations).toEqual([['Auth.syncBackendAuth', { backendUrl: 'https://backend.example.com' }]])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('waitForBackendLogin should retry until backend refresh succeeds', async () => {
  let callCount = 0
  using mockAuthRpc = AuthWorker.registerMockRpc({
    'Auth.syncBackendAuth': async () => {
      callCount++
      if (callCount === 1) {
        return {
          authAccessToken: '',
          authErrorMessage: '',
          userName: '',
          userState: 'loggedOut',
          userSubscriptionPlan: '',
          userUsedTokens: 0,
        }
      }
      return {
        authAccessToken: 'access-token-2',
        authErrorMessage: '',
        userName: 'second-user',
        userState: 'loggedIn',
        userSubscriptionPlan: '',
        userUsedTokens: 0,
      }
    },
  })

  const result = await BackendAuth.waitForBackendLogin('https://backend.example.com', 100, 0)

  expect(result.authAccessToken).toBe('access-token-2')
  expect(result.userName).toBe('second-user')
  expect(result.userState).toBe('loggedIn')
  expect(mockAuthRpc.invocations).toEqual([
    ['Auth.syncBackendAuth', 'https://backend.example.com'],
    ['Auth.syncBackendAuth', 'https://backend.example.com'],
  ])
})

test('waitForElectronBackendLogin should wait for oauth code before syncing backend auth', async () => {
  const originalFetch = globalThis.fetch
  const fetchCalls: Array<readonly [string, Readonly<RequestInit> | undefined]> = []
  globalThis.fetch = async (...args: readonly unknown[]): Promise<Response> => {
    const [input, init] = args as readonly [unknown, Readonly<RequestInit> | undefined]
    fetchCalls.push([getRequestUrl(input), init])
    return {
      ok: true,
      status: 204,
    } as Response
  }
  let codeCallCount = 0
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'OAuthServer.getCode': async () => {
      codeCallCount++
      return codeCallCount === 1 ? '' : 'code-1'
    },
  })
  using mockAuthRpc = AuthWorker.registerMockRpc({
    'Auth.syncBackendAuth': async () => ({
      authAccessToken: 'access-token-electron',
      authErrorMessage: '',
      userName: 'electron-user',
      userState: 'loggedIn',
      userSubscriptionPlan: 'pro',
      userUsedTokens: 11,
    }),
  })

  try {
    const result = await BackendAuth.waitForElectronBackendLogin('https://backend.example.com', 123, 'http://localhost:4567', 100, 0)
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
        'https://backend.example.com/auth/native/exchange',
        {
          body: JSON.stringify({
            code: 'code-1',
            redirectUri: 'http://localhost:4567',
          }),
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
        },
      ],
    ])
    expect(mockAuthRpc.invocations).toEqual([['Auth.syncBackendAuth', 'https://backend.example.com']])
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

test('getBackendLoginRequest should return login url and redirect uri on electron', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'OAuthServer.create': async () => 4567,
  })

  const result = await BackendAuth.getBackendLoginRequest('https://backend.example.com', 2, 123)

  expect(result).toEqual({
    loginUrl: 'https://backend.example.com/login?redirect_uri=http%3A%2F%2Flocalhost%3A4567',
    redirectUri: 'http://localhost:4567',
  })
  expect(mockRendererRpc.invocations).toEqual([['OAuthServer.create', '123']])
})

test('logoutFromBackend should post to backend logout endpoint', async () => {
  const originalFetch = globalThis.fetch
  const fetchCalls: Array<readonly [string, Readonly<RequestInit> | undefined]> = []
  globalThis.fetch = async (...args: readonly unknown[]): Promise<Response> => {
    const [input, init] = args as readonly [unknown, Readonly<RequestInit> | undefined]
    fetchCalls.push([getRequestUrl(input), init])
    return {
      ok: true,
      status: 204,
    } as Response
  }

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
