import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffSelection from '../src/parts/DiffSelection/DiffSelection.ts'

test('diffSelection should return true when composer selection is unchanged', () => {
  const oldState = createDefaultState()
  const newState = createDefaultState()
  expect(DiffSelection.diffSelection(oldState, newState)).toBe(true)
})

test('diffSelection should return false when composer selection start changes', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    composerSelectionStart: 1,
  }
  expect(DiffSelection.diffSelection(oldState, newState)).toBe(false)
})

test('diffSelection should return false when composer selection end changes', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    composerSelectionEnd: 3,
  }
  expect(DiffSelection.diffSelection(oldState, newState)).toBe(false)
})
