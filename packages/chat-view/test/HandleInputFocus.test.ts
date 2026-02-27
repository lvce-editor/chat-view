import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleInputFocus from '../src/parts/HandleInputFocus/HandleInputFocus.ts'

test('handleInputFocus should keep state for composer', async () => {
  const state = createDefaultState()
  const result = await HandleInputFocus.handleInputFocus(state, 'composer')
  expect(result).toBe(state)
})

test('handleInputFocus should keep state for other elements', async () => {
  const state = createDefaultState()
  const result = await HandleInputFocus.handleInputFocus(state, 'other')
  expect(result).toBe(state)
})
