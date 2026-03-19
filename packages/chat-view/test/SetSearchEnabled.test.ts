import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetSearchEnabled from '../src/parts/SetSearchEnabled/SetSearchEnabled.ts'

test('setSearchEnabled should set searchEnabled to true', () => {
  const state = createDefaultState()
  const result = SetSearchEnabled.setSearchEnabled(state, true)
  expect(result.searchEnabled).toBe(true)
})

test('setSearchEnabled should hide and clear search when disabling', () => {
  const state = {
    ...createDefaultState(),
    searchEnabled: true,
    searchFieldVisible: true,
    searchValue: 'chat',
  }
  const result = SetSearchEnabled.setSearchEnabled(state, false)
  expect(result.searchEnabled).toBe(false)
  expect(result.searchFieldVisible).toBe(false)
  expect(result.searchValue).toBe('')
})
