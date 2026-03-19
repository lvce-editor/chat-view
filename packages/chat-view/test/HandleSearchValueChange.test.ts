import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleSearchValueChange from '../src/parts/HandleSearchValueChange/HandleSearchValueChange.ts'

test('handleSearchValueChange should update searchValue', () => {
  const state = createDefaultState()
  const result = HandleSearchValueChange.handleSearchValueChange(state, 'abc')
  expect(result.searchValue).toBe('abc')
})
