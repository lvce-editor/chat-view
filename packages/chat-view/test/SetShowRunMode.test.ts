import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetShowRunMode from '../src/parts/SetShowRunMode/SetShowRunMode.ts'

test('setShowRunMode should set showRunMode to false', () => {
  const state = createDefaultState()
  const result = SetShowRunMode.setShowRunMode(state, false)
  expect(result.showRunMode).toBe(false)
})

test('setShowRunMode should close the picker when disabling', () => {
  const state = {
    ...createDefaultState(),
    runModePickerOpen: true,
    showRunMode: true,
  }
  const result = SetShowRunMode.setShowRunMode(state, false)
  expect(result.showRunMode).toBe(false)
  expect(result.runModePickerOpen).toBe(false)
})
