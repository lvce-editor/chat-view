import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffSelection from '../src/parts/DiffSelection/DiffSelection.ts'

function createState(overrides: Partial<ChatState> = {}): ChatState {
  return {
    ...createDefaultState(),
    ...overrides,
  }
}

test('diffSelection should return true when composer selection is unchanged', () => {
  const oldState = createState()
  const newState = createState()
  expect(DiffSelection.diffSelection(oldState, newState)).toBe(true)
})

test('diffSelection should return false when composer selection start changes', () => {
  const oldState = createState()
  const newState = createState({ composerSelectionStart: 1 })
  expect(DiffSelection.diffSelection(oldState, newState)).toBe(false)
})

test('diffSelection should return false when composer selection end changes', () => {
  const oldState = createState()
  const newState = createState({ composerSelectionEnd: 3 })
  expect(DiffSelection.diffSelection(oldState, newState)).toBe(false)
})
