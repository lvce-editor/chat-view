import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleAuthStateChange from '../src/parts/HandleAuthStateChange/HandleAuthStateChange.ts'

test('handleAuthStateChange merges auth fields into chat state', () => {
  const state = createDefaultState()

  const result = HandleAuthStateChange.handleAuthStateChange(state, {
    authAccessToken: 'access-token-1',
    authErrorMessage: '',
    userName: 'test-user',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
  })

  expect(result).toMatchObject({
    authAccessToken: 'access-token-1',
    authErrorMessage: '',
    userName: 'test-user',
    userState: 'loggedIn',
    userSubscriptionPlan: 'pro',
    userUsedTokens: 42,
  })
})
