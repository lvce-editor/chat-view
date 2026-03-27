import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetScrollDownButtonEnabled from '../src/parts/SetScrollDownButtonEnabled/SetScrollDownButtonEnabled.ts'

test('setScrollDownButtonEnabled should set scrollDownButtonEnabled to true', () => {
  const state = createDefaultState()
  const result = SetScrollDownButtonEnabled.setScrollDownButtonEnabled(state, true)
  expect(result.scrollDownButtonEnabled).toBe(true)
})
