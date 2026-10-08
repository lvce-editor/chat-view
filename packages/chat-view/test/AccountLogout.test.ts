import { expect, test } from '@jest/globals'
import { AuthWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getAuthState } from '../src/parts/GetAuthState/GetAuthState.ts'
import { handleClickLogin } from '../src/parts/HandleClickLogin/HandleClickLogin.ts'
import { handleClickLogout } from '../src/parts/HandleClickLogout/HandleClickLogout.ts'

test('managed sign-out keeps the next selected account signed in and excludes refresh credentials from view state', async () => {
  using authRpc = AuthWorker.registerMockRpc({
    'Auth.logout': async () => ({
      authAccessToken: 'token-A',
      authClientId: 'client-A',
      authRefreshToken: 'refresh-A',
      userName: 'User A',
      userState: 'loggedIn',
    }),
  })
  using rendererRpc = RendererWorker.registerMockRpc({ 'Chat.rerender': async () => {} })
  const state = { ...createDefaultState(), backendUrl: 'https://backend.test', uid: 8, useAuthWorker: true }
  const result = await handleClickLogout(state)
  expect(getAuthState(result)).toMatchObject({ authAccessToken: 'token-A', userName: 'User A', userState: 'loggedIn' })
  expect(result).not.toHaveProperty('authAccessToken')
  expect(result).not.toHaveProperty('authRefreshToken')
  expect(result).not.toHaveProperty('authClientId')
  expect(authRpc.invocations).toEqual([['Auth.logout', { backendUrl: 'https://backend.test' }]])
  expect(rendererRpc.invocations).toEqual([['Chat.rerender']])
})

test('managed login exposes profile fields while keeping credentials outside serializable view state', async () => {
  using authRpc = AuthWorker.registerMockRpc({
    'Auth.login': async () => ({
      authAccessToken: 'token-B',
      authClientId: 'client-B',
      authRefreshToken: 'refresh-B',
      userName: 'User B',
      userState: 'loggedIn',
    }),
  })
  const state = { ...createDefaultState(), backendUrl: 'https://backend.test', uid: 9, useAuthWorker: true }
  const result = await handleClickLogin(state)
  expect(getAuthState(result)).toMatchObject({ authAccessToken: 'token-B', userName: 'User B', userState: 'loggedIn' })
  expect(result).not.toHaveProperty('authAccessToken')
  expect(result).not.toHaveProperty('authRefreshToken')
  expect(result).not.toHaveProperty('authClientId')
  expect(authRpc.invocations[0][0]).toBe('Auth.login')
})
