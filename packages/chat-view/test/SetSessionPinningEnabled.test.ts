import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetSessionPinningEnabled from '../src/parts/SetSessionPinningEnabled/SetSessionPinningEnabled.ts'

test('setSessionPinningEnabled should set sessionPinningEnabled to false', () => {
  const state = createDefaultState()
  const result = SetSessionPinningEnabled.setSessionPinningEnabled(state, false)
  expect(result.sessionPinningEnabled).toBe(false)
})
