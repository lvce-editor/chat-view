import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetAddContextButtonEnabled from '../src/parts/SetAddContextButtonEnabled/SetAddContextButtonEnabled.ts'

test('setAddContextButtonEnabled should set addContextButtonEnabled to true', () => {
  const state = createDefaultState()
  const result = SetAddContextButtonEnabled.setAddContextButtonEnabled(state, true)
  expect(result.addContextButtonEnabled).toBe(true)
})

test('setAddContextButtonEnabled should set addContextButtonEnabled to false', () => {
  const state = createDefaultState()
  const result = SetAddContextButtonEnabled.setAddContextButtonEnabled(
    {
      ...state,
      addContextButtonEnabled: true,
    },
    false,
  )
  expect(result.addContextButtonEnabled).toBe(false)
})
