import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetReasoningPickerEnabled from '../src/parts/SetReasoningPickerEnabled/SetReasoningPickerEnabled.ts'

test('setReasoningPickerEnabled should set reasoningPickerEnabled to true', () => {
  const state = createDefaultState()
  const result = SetReasoningPickerEnabled.setReasoningPickerEnabled(state, true)
  expect(result.reasoningPickerEnabled).toBe(true)
})

test('setReasoningPickerEnabled should close the picker when disabling', () => {
  const state = {
    ...createDefaultState(),
    reasoningEffortPickerOpen: true,
    reasoningPickerEnabled: true,
  }
  const result = SetReasoningPickerEnabled.setReasoningPickerEnabled(state, false)
  expect(result.reasoningPickerEnabled).toBe(false)
  expect(result.reasoningEffortPickerOpen).toBe(false)
})
