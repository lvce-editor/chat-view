import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetAuthState from '../src/parts/GetAuthState/GetAuthState.ts'

test('getAuthState should return auth-related fields from state', () => {
  const state = {
    ...createDefaultState(),
    authAccessToken: 'access-token',
    authEnabled: true,
    authErrorMessage: 'failed',
    authMaxDelay: 2345,
    backendUrl: 'https://example.com',
    userName: 'test-user',
    userState: 'loggedIn' as const,
    userSubscriptionPlan: 'pro',
    userUsedTokens: 123,
  }

  const result = GetAuthState.getAuthState(state)

  expect(result).toEqual({
    authAccessToken: 'access-token',
    authEnabled: true,
    authErrorMessage: 'failed',
    authMaxDelay: 2345,
    backendUrl: 'https://example.com',
    userName: 'test-user',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 123,
  })
})
