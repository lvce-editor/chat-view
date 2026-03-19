import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetAuthState from '../src/parts/GetAuthState/GetAuthState.ts'

test('getAuthState should return auth-related fields from state', () => {
  const state = {
    ...createDefaultState(),
    authAccessToken: 'access-token',
    authEnabled: true,
    authErrorMessage: 'failed',
    authRefreshToken: 'refresh-token',
    authStatus: 'signed-in' as const,
    backendUrl: 'https://example.com',
    userName: 'test-user',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 123,
  }

  const result = GetAuthState.getAuthState(state)

  expect(result).toEqual({
    authAccessToken: 'access-token',
    authEnabled: true,
    authErrorMessage: 'failed',
    authRefreshToken: 'refresh-token',
    authStatus: 'signed-in',
    backendUrl: 'https://example.com',
    userName: 'test-user',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 123,
  })
})
