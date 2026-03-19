import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetNewChatModelPickerEnabled from '../src/parts/SetNewChatModelPickerEnabled/SetNewChatModelPickerEnabled.ts'

test('setNewChatModelPickerEnabled should enable feature flag', () => {
  const state = createDefaultState()
  const result = SetNewChatModelPickerEnabled.setNewChatModelPickerEnabled(state, true)
  expect(result.newChatModelPickerEnabled).toBe(true)
})

test('setNewChatModelPickerEnabled should close and clear picker state when disabling', () => {
  const state = {
    ...createDefaultState(),
    modelPickerOpen: true,
    modelPickerSearchValue: 'gpt',
    newChatModelPickerEnabled: true,
  }
  const result = SetNewChatModelPickerEnabled.setNewChatModelPickerEnabled(state, false)
  expect(result.newChatModelPickerEnabled).toBe(false)
  expect(result.modelPickerOpen).toBe(false)
  expect(result.modelPickerSearchValue).toBe('')
})
